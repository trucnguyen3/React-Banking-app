import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { apiService } from '../services/api'; // <-- Import apiService
const CleverTap = require('clevertap-react-native');

const CardConfirmNidScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};
  const [nid, setNid] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy thông tin user (đặc biệt là số NID) từ DB khi load màn hình
  useEffect(() => {
    const fetchUserNidFromDb = async () => {
      try {
        if (userId) {
          const res = await apiService.getUserProfile(userId);
          if (res) {
            // Lấy id_card_number hoặc nidNumber từ DB trả về
            const dbNid = res.id_card_number || res.nidNumber || '';
            setNid(dbNid);
          }
        }
      } catch (error) {
        console.error('Lỗi tải NID từ DB:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNidFromDb();
  }, [userId]);

  const handleNext = () => {
    Keyboard.dismiss();

    if (!nid || nid.length < 9) {
      Alert.alert('Lỗi', 'Số NID không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    CleverTap.recordEvent('card_nid_confirmed', { screen_id: 36, card_type: cardType });

    // Chuyển sang màn hình xác nhận thông tin chung tiếp theo
    navigation.navigate('CardConfirmInfoScreen', {
      cardType,
      nidNumber: nid,
      userId,
      identifier,
      name,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, justifyContent: 'space-between' }}>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
            >
              <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
              Xác nhận số NID
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 20, marginBottom: 28 }}>
              Hệ thống đã đồng bộ số NID từ tài khoản của bạn. Vui lòng kiểm tra lại.
            </Text>

            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' }}>
              Số NID (National ID)
            </Text>

            {loading ? (
              <ActivityIndicator size="small" color="#0066CC" style={{ marginVertical: 20 }} />
            ) : (
              <TextInput
                style={{
                  backgroundColor: '#161D2F',
                  borderWidth: 1.5,
                  borderColor: '#0066CC',
                  borderRadius: 16,
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: '700',
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  letterSpacing: 2,
                }}
                keyboardType="number-pad"
                maxLength={12}
                value={nid}
                onChangeText={setNid}
                placeholder="Nhập số NID"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
              />
            )}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: '#0066CC',
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Xác nhận & Tiếp tục
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CardConfirmNidScreen;
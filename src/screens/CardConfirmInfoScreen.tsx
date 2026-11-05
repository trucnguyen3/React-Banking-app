import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { apiService } from '../services/api';
const CleverTap = require('clevertap-react-native');

const CardConfirmInfoScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name, nidNumber } = route?.params || {};
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: name || 'Guest',
    idNumber: nidNumber || 'N/A',
    phone: identifier || 'N/A',
    address: 'Ho Chi Minh City, Vietnam',
  });

  // Gọi API lấy thông tin mới nhất từ DB (nếu route params thiếu)
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        if (userId) {
          const res = await apiService.getUserProfile(userId);
          if (res) {
            setProfileData({
              fullName: res.full_name || res.fullName || name || 'Guest',
              idNumber: nidNumber || res.id_card_number || res.nidNumber || 'N/A',
              phone: identifier || res.phone_number || res.phoneNumber || 'N/A',
              address: 'Ho Chi Minh City, Vietnam',
            });
          }
        }
      } catch (error) {
        console.error('Lỗi tải thông tin xác nhận thẻ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, [userId, nidNumber]);

  const userInfo = {
    ...profileData,
    limit: cardType === 'premium' ? '120,000,000 ₫' : '12,000,000 ₫',
  };

  const handleConfirm = () => {
    CleverTap.recordEvent('card_info_confirmed', { screen_id: 4, card_type: cardType });
    navigation.navigate('CardReviewContractScreen', { cardType, userId, identifier, name, userInfo });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
            Xác nhận thông tin
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 24 }}>
            Vui lòng kiểm tra kỹ thông tin đăng ký phát hành thẻ của bạn.
          </Text>

          {/* Card Info Box */}
          <View style={{ backgroundColor: '#161D2F', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            {loading ? (
              <ActivityIndicator size="small" color="#0066CC" style={{ marginVertical: 30 }} />
            ) : (
              [
                { label: 'Họ và tên', value: userInfo.fullName },
                { label: 'Số CCCD/CMND', value: userInfo.idNumber },
                { label: 'Số điện thoại', value: userInfo.phone },
                { label: 'Địa chỉ nhận thẻ', value: userInfo.address },
                { label: 'Loại thẻ phát hành', value: cardType },
                { label: 'Hạn mức đề xuất', value: userInfo.limit, highlight: true },
              ].map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: index === 5 ? 0 : 1, borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }}>{item.label}</Text>
                  <Text style={{ color: item.highlight ? '#FACC15' : '#FFFFFF', fontSize: 14, fontWeight: '700' }}>{item.value}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          style={{
            backgroundColor: '#0066CC',
            paddingVertical: 18,
            borderRadius: 30,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            Xác nhận & Tiếp tục
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardConfirmInfoScreen;
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { apiService } from '../services/api'; // <-- Import apiService
const CleverTap = require('clevertap-react-native');

const CardSuccessScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};

  useEffect(() => {
    CleverTap.recordEvent('card_apply_completed', { screen_id: 6, card_type: cardType });

    // Gọi API lưu thẻ vào Database ngay khi đến màn hình thành công
    const saveCardToDatabase = async () => {
      try {
        await apiService.applyForCard({
          userId: userId || 'GUEST_USER',
          cardType: cardType,
          cardCategory: 'Credit Card',
        });
        console.log('✅ Đã lưu thẻ thành công vào database');
      } catch (error) {
        console.error('❌ Lỗi lưu thẻ vào DB:', error);
      }
    };

    saveCardToDatabase();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 24, justifyContent: 'space-between', alignItems: 'center' }}>
        <View />

        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <FontAwesome name="check-circle" size={56} color="#10B981" />
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
            Đăng ký thẻ thành công!
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, textAlign: 'center', paddingHorizontal: 20, marginBottom: 28 }}>
            Thẻ ảo của bạn đã được kích hoạt và đồng bộ lên hệ thống.
          </Text>

          <Image
            source={cardType === 'CR Golden' ? require('../../AppImages/credit_card.png') : require('../../AppImages/debit_card.png')}
            style={{ width: 220, height: 140, borderRadius: 16 }}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home', params: { userId, identifier, name, refreshCards: Date.now() } })}
          style={{
            backgroundColor: '#0066CC',
            paddingVertical: 18,
            width: '100%',
            borderRadius: 30,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            Về màn hình chính
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CardSuccessScreen;
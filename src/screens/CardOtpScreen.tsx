import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const CardOtpScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = () => {
    Keyboard.dismiss(); // Tự động ẩn bàn phím khi bấm xác nhận

    if (otp.length < 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }

    CleverTap.recordEvent('card_otp_success', { screen_id: 2, card_type: cardType });
    
    // Chuyển tiếp sang màn hình Face ID
    navigation.navigate('CardFaceIdScreen', { cardType, userId, identifier, name });
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
              Xác thực OTP
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 20, marginBottom: 32 }}>
              Mã OTP gồm 6 chữ số đã được gửi đến số điện thoại đăng ký tài khoản của bạn.
            </Text>

            <TextInput
              style={{
                backgroundColor: '#161D2F',
                borderWidth: 1.5,
                borderColor: '#0066CC',
                borderRadius: 16,
                color: '#FFFFFF',
                fontSize: 24,
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: 12,
                paddingVertical: 16,
                marginBottom: 16,
              }}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              placeholder="000000"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
            />

            <View style={tw`flex-row justify-center items-center`}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }}>
                Chưa nhận được mã?{' '}
              </Text>
              <TouchableOpacity disabled={timer > 0} onPress={() => setTimer(60)}>
                <Text style={{ color: timer === 0 ? '#0066CC' : 'rgba(255, 255, 255, 0.4)', fontWeight: '700', fontSize: 13 }}>
                  {timer > 0 ? `Gửi lại (${timer}s)` : 'Gửi lại ngay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleVerifyOtp}
            style={{
              backgroundColor: '#0066CC',
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Xác nhận OTP
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CardOtpScreen;
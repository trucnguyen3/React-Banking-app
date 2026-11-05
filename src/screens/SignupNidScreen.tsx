import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const SignupNidScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [nidNumber, setNidNumber] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const formattedPhone = phoneNumber.replace(/^0/, '+84');

  // 1. Hàm giả lập quét thẻ CCCD (OCR Scan Card)
  const handleScanCard = () => {
    Keyboard.dismiss();
    setIsScanning(true);

    // Giả lập thời gian quét camera OCR (1.5 giây)
    setTimeout(() => {
      setIsScanning(false);
      // Tự động sinh ra một số CCCD giả lập từ kết quả quét OCR thành công
      const scannedDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      setNidNumber(scannedDigits);

      CleverTap.recordEvent('ekyc_card_scan_success', {
        'screen_id': 17,
        'screen_name': 'id scan OCR',
        'phone_number': formattedPhone,
        'national_id': scannedDigits
      });

      Alert.alert('Thành công', 'Quét thẻ CCCD thành công! Đã tự động điền số định danh.');
    }, 1500);
  };

  // 2. Hàm random số NID phục vụ test nhanh
  const handleRandomNid = () => {
    Keyboard.dismiss();
    const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setNidNumber(randomDigits);
  };

  const handleNext = () => {
    Keyboard.dismiss();

    if (!nidNumber || nidNumber.length < 9) {
      Alert.alert('Lỗi', 'Vui lòng quét thẻ, nhập hoặc tạo số NID (CCCD) hợp lệ.');
      return;
    }

    CleverTap.recordEvent('ekyc_nid', {
      'screen_id': 17,
      'screen_name': 'id scan',
      'phone_number': formattedPhone,
      'national_id': nidNumber
    });

    // Chuyển sang màn hình xác nhận thông tin đăng ký (SignupFormScreen)
    navigation.navigate('SignupFormScreen', { phoneNumber, nidNumber });
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
              Xác thực NID / CCCD
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 20, marginBottom: 24 }}>
              Bạn có thể quét thẻ CCCD tự động, bấm random hoặc tự nhập thủ công số định danh.
            </Text>

            {/* Nút gọi tính năng Quét thẻ OCR */}
            <TouchableOpacity
              onPress={handleScanCard}
              disabled={isScanning}
              style={{
                backgroundColor: '#161D2F',
                borderWidth: 1.5,
                borderColor: '#0066CC',
                borderRadius: 16,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                shadowColor: '#0066CC',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              {isScanning ? (
                <>
                  <ActivityIndicator size="small" color="#0066CC" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Đang quét thẻ CCCD...</Text>
                </>
              ) : (
                <>
                  <FontAwesome name="camera" size={18} color="#0066CC" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Quét thẻ CCCD tự động (OCR)</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>
                Số NID / CCCD
              </Text>
              
              {/* Nút Random nhanh số NID */}
              <TouchableOpacity onPress={handleRandomNid} style={tw`flex-row items-center`}>
                <FontAwesome name="random" size={12} color="#0066CC" style={{ marginRight: 6 }} />
                <Text style={{ color: '#0066CC', fontSize: 12, fontWeight: '700' }}>
                  Random số NID
                </Text>
              </TouchableOpacity>
            </View>

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
              value={nidNumber}
              onChangeText={setNidNumber}
              placeholder="Nhập hoặc quét thẻ CCCD"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
            />
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
              Tiếp tục
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignupNidScreen;
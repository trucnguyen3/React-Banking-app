import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const CardScanNidScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};
  const [scanning, setScanning] = useState(false);

  const handleStartScan = () => {
    setScanning(true);
    // Giả lập quá trình AI quét NID thành công sau 2 giây
    setTimeout(() => {
      setScanning(false);
      const simulatedNid = "079199008888"; // Số NID đọc được từ OCR
      CleverTap.recordEvent('card_scan_nid_success', { screen_id: 35, card_type: cardType });

      // Chuyển sang màn hình xác nhận/nhập lại số NID
      navigation.navigate('CardConfirmNidScreen', {
        cardType,
        nidNumber: simulatedNid,
        userId,
        identifier,
        name,
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 6 }}>
            Quét thẻ định danh (NID)
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, textAlign: 'center', paddingHorizontal: 10 }}>
            Đặt mặt trước thẻ NID của bạn vào trong khung hình để hệ thống tự động nhận diện.
          </Text>
        </View>

        {/* Khung ngắm quét NID */}
        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <View
            style={{
              width: '100%',
              height: 200,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: scanning ? '#0066CC' : 'rgba(255, 255, 255, 0.4)',
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#161D2F',
            }}
          >
            {scanning ? (
              <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={{ color: '#0066CC', fontSize: 13, fontWeight: '600', marginTop: 12 }}>
                  Đang trích xuất dữ liệu NID...
                </Text>
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <FontAwesome name="id-card-o" size={64} color="rgba(255, 255, 255, 0.5)" />
                <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, marginTop: 10 }}>
                  Chụp mặt trước NID
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleStartScan}
          disabled={scanning}
          style={{
            backgroundColor: '#0066CC',
            paddingVertical: 18,
            width: '100%',
            borderRadius: 30,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            {scanning ? 'Đang xử lý...' : 'Chụp ảnh / Quét NID'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CardScanNidScreen;
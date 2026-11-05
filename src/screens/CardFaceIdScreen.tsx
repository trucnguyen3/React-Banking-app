import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const CardFaceIdScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};
  const [scanning, setScanning] = useState(false);

  const handleScanFace = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      CleverTap.recordEvent('card_faceid_success', { screen_id: 3, card_type: cardType });
      
      // Chuyển sang màn hình confirm thông tin
      navigation.navigate('CardScanNidScreen', { cardType, userId, identifier, name });
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            Xác thực Face ID
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>
            Vui lòng giữ khuôn mặt trong khung hình để tiến hành đối soát sinh trắc học.
          </Text>
        </View>

        {/* Khung mô phỏng quét FaceID */}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              borderWidth: 3,
              borderColor: scanning ? '#0066CC' : 'rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#161D2F',
            }}
          >
            {scanning ? (
              <ActivityIndicator size="large" color="#0066CC" />
            ) : (
              <FontAwesome name="user-circle" size={100} color="rgba(255, 255, 255, 0.6)" />
            )}
          </View>
          <Text style={{ color: scanning ? '#0066CC' : 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontWeight: '600', marginTop: 20 }}>
            {scanning ? 'Đang quét khuôn mặt...' : 'Sẵn sàng quét'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleScanFace}
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
            Bắt đầu quét khuôn mặt
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CardFaceIdScreen;
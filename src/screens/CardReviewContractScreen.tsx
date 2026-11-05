import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const CardReviewContractScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { cardType, userId, identifier, name } = route?.params || {};
  const [agreed, setAgreed] = useState(false);

  const handleSignContract = () => {
    if (!agreed) {
      Alert.alert('Lưu ý', 'Vui lòng đọc và đồng ý với các điều khoản hợp đồng.');
      return;
    }

    CleverTap.recordEvent('card_contract_signed', { screen_id: 5, card_type: cardType });
    navigation.navigate('CardSuccessScreen', { cardType, userId, identifier, name });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginBottom: 6 }}>
            Hợp đồng phát hành thẻ
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, marginBottom: 16 }}>
            Chi tiết hợp đồng điện tử dịch vụ phát hành thẻ tín dụng Cake 2in1.
          </Text>

          {/* Vùng xem nội dung Hợp đồng */}
          <ScrollView
            style={{ backgroundColor: '#161D2F', borderRadius: 16, padding: 16, maxHeight: 320, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginBottom: 8 }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
              Độc lập - Tự do - Hạnh phúc
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, lineHeight: 18 }}>
              1. Khách hàng cam kết cung cấp đầy đủ thông tin trung thực khi đăng ký phát hành thẻ.{'\n\n'}
              2. Ngân hàng cấp hạn mức tín dụng dựa trên hồ sơ thẩm định điện tử.{'\n\n'}
              3. Khách hàng có trách nhiệm thanh toán các khoản dư nợ đúng hạn hàng tháng để không phát sinh chi phí phạt chậm trả.
            </Text>
          </ScrollView>

          {/* Checkbox đồng ý điều khoản */}
          <TouchableOpacity
            onPress={() => setAgreed(!agreed)}
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: agreed ? '#0066CC' : 'rgba(255, 255, 255, 0.4)', backgroundColor: agreed ? '#0066CC' : 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              {agreed && <FontAwesome name="check" size={12} color="#FFFFFF" />}
            </View>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, flex: 1 }}>
              Tôi đã đọc, hiểu rõ và đồng ý với tất cả các điều khoản trong hợp đồng.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSignContract}
          style={{
            backgroundColor: agreed ? '#0066CC' : 'rgba(255, 255, 255, 0.2)',
            paddingVertical: 18,
            borderRadius: 30,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
            Ký hợp đồng & Phát hành
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CardReviewContractScreen;
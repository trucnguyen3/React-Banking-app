import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

const cardPackages = [
  {
    id: "premium",
    badge: "GÓI PREMIUM",
    badgeBg: "#0066CC",
    name: "CR Golden", // <-- Tên thẻ cần lấy
    cashback: "120 TRIỆU",
    desc: "Hoàn tiền đến 120 triệu đồng/năm",
    image: require('../../AppImages/credit_card.png'),
    borderColor: '#FFFFFF',
  },
  {
    id: "standard",
    badge: "GÓI STANDARD",
    badgeBg: "#0066CC",
    name: "CR Black", // <-- Tên thẻ cần lấy
    cashback: "12 TRIỆU",
    desc: "Hoàn tiền đến 12 triệu đồng/năm",
    image: require('../../AppImages/debit_card.png'),
    borderColor: '#FFFFFF',
  }
];

const CardApplyScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { identifier, name, userId } = route?.params || {};
  
  // Lưu trực tiếp tên gói thẻ được chọn (Mặc định ban đầu là gói đầu tiên "CR Golden")
  const [selectedCard, setSelectedCard] = useState(cardPackages[0].name);

  CleverTap.recordEvent('card_onboarding_view', {
    'screen_id': 1,
    'screen_name': 'card apply'
  });

  const handleApply = () => {
    CleverTap.recordEvent('card_apply_start', {
      'screen_id': 1,
      'screen_name': 'card apply',
      'card_type': selectedCard, // Gửi tên thẻ lên CleverTap
    });

    // Chuyển sang màn hình tiếp theo và truyền cardType chính là tên thẻ đã chọn
    navigation.navigate('CardOtpScreen', {
      cardType: selectedCard, // Truyền "CR Golden" hoặc "CR Black"
      userId,
      identifier,
      name,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <ScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'space-between', 
          paddingHorizontal: 20, 
          paddingTop: 16, 
          paddingBottom: 20 
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* KHỐI NỘI DUNG TRÊN */}
        <View>
          {/* Nút Đóng (X) trên iOS */}
          <View style={tw`flex-row justify-end mb-4`}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MainTabs", { screen: "Home", params: { userId, identifier, name } })}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome name="times" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Title Header */}
          <View style={tw`items-center mb-8`}>
            <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '300', fontStyle: 'italic', marginBottom: 6 }}>
              The Chosen
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 1, textAlign: 'center' }}>
              THẺ TÍN DỤNG HOÀN TIỀN ĐẾN 120 TRIỆU/NĂM
            </Text>
          </View>

          {/* 2 CARD GÓI VỚI VIỀN XANH & TRẮNG */}
          <View style={tw`flex-row justify-between mb-4`}>
            {cardPackages.map((item) => {
              // So sánh dựa trên item.name thay vì id
              const isSelected = selectedCard === item.name;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedCard(item.name)} // Cập nhật state thành tên thẻ (CR Golden / CR Black)
                  style={{
                    width: '48%',
                    borderRadius: 22,
                    padding: 14,
                    alignItems: 'center',
                    backgroundColor: isSelected ? '#161D2F' : '#111625',
                    borderWidth: isSelected ? 2.5 : 1,
                    borderColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)',
                    shadowColor: '#0066CC',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: isSelected ? 0.5 : 0.1,
                    shadowRadius: 10,
                  }}
                >
                  {/* Badge gói màu xanh */}
                  <View
                    style={{
                      backgroundColor: item.badgeBg,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginBottom: 14,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 }}>
                      {item.badge}
                    </Text>
                  </View>

                  {/* Hiển thị Tên thẻ trực tiếp trên UI nếu muốn */}
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 10 }}>
                    {item.name}
                  </Text>

                  {/* Ảnh thẻ to rõ */}
                  <Image
                    source={item.image}
                    style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 14 }}
                    resizeMode="contain"
                  />

                  {/* Thông tin hoàn tiền */}
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, textAlign: 'center', marginBottom: 4 }}>
                    Hoàn tiền đến
                  </Text>
                  <Text style={{ color: isSelected ? '#FACC15' : '#FFFFFF', fontSize: 18, fontWeight: '900', textAlign: 'center' }}>
                    {item.cashback}
                  </Text>

                  {/* Dấu check góc thẻ khi chọn */}
                  {isSelected && (
                    <View 
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#0066CC',
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: '#FFFFFF',
                      }}
                    >
                      <FontAwesome name="check" size={13} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* NÚT BẤM PHÁT HÀNH THẺ */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 11, textAlign: 'center', marginBottom: 14 }}>
            (*) Điều kiện, điều khoản áp dụng
          </Text>

          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#0066CC',
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0066CC',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }}>
              Phát hành thẻ ngay
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CardApplyScreen;
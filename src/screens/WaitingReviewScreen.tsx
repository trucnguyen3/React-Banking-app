import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingReviewScreen'>;

const WaitingReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { signupData } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      CleverTap.recordEvent('ekyc_review', {
        'screen_id': 15,
        'screen_name': 'review user info'
      });

      // Chuyển sang SuccessScreen
      navigation.replace('SuccessScreen', {
        name: signupData?.fullName || signupData?.name || 'User',
        signupData: signupData,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, signupData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {/* Card hiển thị trạng thái chờ */}
        <View
          style={{
            width: '100%',
            backgroundColor: '#161D2F',
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: 'rgba(0, 102, 204, 0.4)',
            shadowColor: '#0066CC',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {/* Biểu tượng Shield & Loading */}
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: 'rgba(0, 102, 204, 0.15)',
              justifyContent: 'center', // Sửa từ 'justify' thành 'justifyContent'
              alignItems: 'center',
              marginBottom: 24,
              borderWidth: 2,
              borderColor: '#0066CC',
            }}
          >
            <FontAwesome name="shield" size={40} color="#0066CC" />
          </View>

          <ActivityIndicator size="large" color="#0066CC" style={{ marginBottom: 20 }} />

          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>
            Reviewing Application
          </Text>

          <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
            Please wait while our system verifies your identity and NID details securely...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WaitingReviewScreen;
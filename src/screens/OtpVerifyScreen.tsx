import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerifyScreen'>;

const OtpVerifyScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    Keyboard.dismiss();
    if (otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }

    const formattedPhone = phoneNumber.replace(/^0/, '+84');
    CleverTap.recordEvent('ekyc_otp', { 'screen_id': 10, 'screen_name': 'otp phone', 'phone_number': formattedPhone });
    navigation.navigate('FaceIdScreen', { phoneNumber });
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
              Verify OTP
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 20, marginBottom: 28 }}>
              Enter the 4-digit code sent to <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{phoneNumber}</Text>
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
                paddingHorizontal: 16,
                paddingVertical: 16,
                textAlign: 'center',
                letterSpacing: 8,
              }}
              placeholder="----"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              maxLength={4}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          <TouchableOpacity
            onPress={handleVerifyOtp}
            style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 20 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OtpVerifyScreen;
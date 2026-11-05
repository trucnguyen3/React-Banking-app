import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneInputScreen'>;

const PhoneInputScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleSendOtp = () => {
    Keyboard.dismiss();
    if (!phone || phone.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    const formattedPhone = phone.replace(/^0/, '+84');
    CleverTap.recordEvent('ekyc_start', { 'screen_id': 12, 'screen_name': 'input phone', 'phone_number': formattedPhone });
    navigation.navigate('OtpVerifyScreen', { phoneNumber: phone });
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
              Enter Phone Number
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, lineHeight: 20, marginBottom: 28 }}>
              We will send an OTP verification code to your phone securely.
            </Text>

            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' }}>
              Phone Number
            </Text>

            <TextInput
              style={{
                backgroundColor: '#161D2F',
                borderWidth: 1.5,
                borderColor: '#0066CC',
                borderRadius: 16,
                color: '#FFFFFF',
                fontSize: 18,
                fontWeight: '600',
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
              placeholder="e.g. 0912345678"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendOtp}
            style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginBottom: 20 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneInputScreen;
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard, View} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'SignupFormScreen'>;

const SignupFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber, nidNumber } = route.params;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [job, setJob] = useState('');
  const [position, setPosition] = useState('');

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (!email || !name || !address || !job || !position) {
      Alert.alert('Error', 'Please fill in all information fields.');
      return;
    }

    const signupData = { nidNumber, phoneNumber, email, fullName: name, name, address, job, position };
    const formattedPhone = phoneNumber.replace(/^0/, '+84');

    if (email.match(/^([^@]+)/)) {
      CleverTap.onUserLogin({ 'Identity': nidNumber });
    }

    CleverTap.profileSet({
      'Name': name,
      'Email': email,
      'Phone': formattedPhone,
      'Address': address,
      'Job': job,
      'Position': position,
      'MSG-email': true,
      'MSG-sms': true,
      'MSG-whatsapp': true,
    });

    CleverTap.recordEvent('ekyc_submit_info', { 'screen_id': 13, 'screen_name': 'submit additional info' });
    navigation.navigate('ConfirmInfoScreen', { signupData });
  };

  const renderInput = (label: string, placeholder: string, value: string, onChangeText: (val: string) => void, keyboardType = 'default', editable = true) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <TextInput
        style={{
          backgroundColor: editable ? '#161D2F' : 'rgba(22, 29, 47, 0.5)',
          borderWidth: 1.5,
          borderColor: editable ? '#0066CC' : 'rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          color: editable ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
          fontSize: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.3)"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType as any}
        editable={editable}
      />
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 6 }}>
            Personal Information
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 24 }}>
            Please confirm your profile details below.
          </Text>

          {renderInput('National ID (NID)', '', nidNumber, () => {}, 'default', false)}
          {renderInput('Full Name', 'Enter full name', name, setName)}
          {renderInput('Email Address', 'Enter email', email, setEmail, 'email-address')}
          {renderInput('Address', 'Enter residential address', address, setAddress)}
          {renderInput('Job / Industry', 'e.g. Information Technology', job, setJob)}
          {renderInput('Position', 'e.g. Software Engineer', position, setPosition)}

          <TouchableOpacity
            onPress={handleSubmit}
            style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 10, marginBottom: 20 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>Review Information</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignupFormScreen;
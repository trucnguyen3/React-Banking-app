import React from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'FaceIdScreen'>;

const FaceIdScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const formattedPhone = phoneNumber.replace(/^0/, '+84');

  const handleScanFace = () => {
    CleverTap.recordEvent('ekyc_faceid', { 'screen_id': 4, 'screen_name': 'face scan', 'phone_number': formattedPhone });

    Alert.alert('Success', 'Face ID verified successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('SignupNidScreen', { phoneNumber }) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
          >
            <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', width: '100%' }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0, 102, 204, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 2, borderColor: '#0066CC' }}>
            <FontAwesome name="user-circle" size={60} color="#0066CC" />
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
            Face ID Verification
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 }}>
            Please position your face within the frame to verify your identity securely.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleScanFace}
            style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>Scan Face</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FaceIdScreen;
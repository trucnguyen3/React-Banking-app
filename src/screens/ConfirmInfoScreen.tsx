import React, { useState } from 'react';
import { View, ScrollView, Text, Switch, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmInfoScreen'>;

const ConfirmInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { signupData } = route.params;
  const [agreed, setAgreed] = useState(false);

  const handleConfirmAndSubmit = () => {
    if (!agreed) {
      Alert.alert('Consent Required', 'Please allow data consent to proceed.');
      return;
    }

    CleverTap.profileSet({ 'Data Consent': agreed });
    CleverTap.recordEvent('ekyc_confirm_info', { 'screen_id': 2, 'screen_name': 'confirm additional info' });

    navigation.navigate('WaitingReviewScreen', { signupData });
  };

  const renderInfoRow = (label: string, value: string) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
      <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 16 }}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
        >
          <FontAwesome name="arrow-left" size={16} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 6 }}>
          Review Information
        </Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 24 }}>
          Please carefully check your registered details.
        </Text>

        <View style={{ backgroundColor: '#161D2F', borderRadius: 20, padding: 16, marginBottom: 24, borderWidth: 1.5, borderColor: '#0066CC' }}>
          {renderInfoRow('NID / CCCD', signupData?.nidNumber)}
          {renderInfoRow('Phone', signupData?.phoneNumber)}
          {renderInfoRow('Full Name', signupData?.fullName || signupData?.name)}
          {renderInfoRow('Email', signupData?.email)}
          {renderInfoRow('Address', signupData?.address)}
          {renderInfoRow('Job / Industry', signupData?.job)}
          {renderInfoRow('Position', signupData?.position)}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, backgroundColor: '#161D2F', padding: 16, borderRadius: 16 }}>
          <Switch
            value={agreed}
            onValueChange={setAgreed}
            trackColor={{ false: '#333', true: '#0066CC' }}
            thumbColor={'#ffffff'}
          />
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: 12, flex: 1, fontSize: 13, lineHeight: 18 }}>
            I allow consent for data processing and agree to terms & conditions.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleConfirmAndSubmit}
          style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center' }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmInfoScreen;
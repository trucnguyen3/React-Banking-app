import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
const CleverTap = require('clevertap-react-native');
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeScreen'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
          const res = await fetch('https://api-uat1.akadigital.net/api/auth/verify-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
  
          if (data.success) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'MainTabs',
                  params: {
                    userId: data.userId,
                    identifier: data.phoneNumber,
                    name: data.fullName,
                  },
                },
              ],
            });
          }
        }
      } catch (e) {
        console.log('Session check error:', e);
      }
    };
    checkStoredSession();
  }, []);

  useEffect(() => {
    CleverTap.recordEvent('welcome', { 'screen_id': 16, 'screen_name': 'welcome' });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0, 102, 204, 0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
            <FontAwesome name="bank" size={44} color="#0066CC" />
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
            Welcome to AKA Banking
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 }}>
            Your secure, fast, and modern digital financial partner.
          </Text>
        </View>

        <View style={{ width: '100%', marginBottom: 10 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#0066CC', paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#0066CC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
              Get Started / Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
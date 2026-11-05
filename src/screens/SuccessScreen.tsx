import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'SuccessScreen'>;

const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { signupData, name } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerAndRedirect = async () => {
      try {
        // 1. Gọi API lưu user vào Database với idCardNumber đúng chuẩn (nidNumber)
        const response = await apiService.registerUser({
          fullName: name || signupData?.fullName || 'User',
          phoneNumber: signupData?.phoneNumber || '',
          email: signupData?.email || '',
          idCardNumber: signupData?.nidNumber || '', // Đã sửa từ nidNnumber -> nidNumber
        });

        const userId = response?.userId || signupData?.phoneNumber || 'USR_GUEST';
        
        // 2. Lưu token vào AsyncStorage để tự động đăng nhập (Session persistence)
        if (response?.token) {
          await AsyncStorage.setItem('user_token', response.token);
          console.log('🔑 Session token saved successfully');
        }

        console.log('✅ User registered in DB with ID:', userId);

        // 3. Track sự kiện hoàn tất eKYC lên CleverTap
        CleverTap.recordEvent('ekyc_success', {
          screen_id: 14,
          screen_name: 'ekyc success'
        });

        CleverTap.recordEvent('login_success', {
          screen_id: 14,
          screen_name: 'ekyc success'
        });

        // 4. Chờ 2s rồi tự động vào Dashboard
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'MainTabs',
                params: {
                  userId: userId,
                  identifier: signupData?.phoneNumber,
                  name: name,
                  signupData: signupData,
                },
              },
            ],
          });
        }, 2200);
      } catch (error) {
        console.error('API register error on success screen:', error);
        
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'MainTabs',
                params: {
                  userId: signupData?.phoneNumber || 'USR_GUEST',
                  identifier: signupData?.phoneNumber,
                  name: name,
                  signupData: signupData,
                },
              },
            ],
          });
        }, 2200);
      } finally {
        setLoading(false);
      }
    };

    registerAndRedirect();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F19' }}>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40, alignItems: 'center' }}>
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
          {/* Check Circle Glow */}
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24,
              borderWidth: 2,
              borderColor: '#10B981',
            }}
          >
            <FontAwesome name="check-circle" size={56} color="#10B981" />
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            Registration Successful! 🎉
          </Text>

          <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
            Welcome aboard, <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{name}</Text>. Your digital banking profile has been set up successfully.
          </Text>

          {/* User Brief Info Card */}
          <View
            style={{
              width: '100%',
              backgroundColor: '#161D2F',
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, fontWeight: '600' }}>STATUS</Text>
              <Text style={{ color: '#10B981', fontSize: 13, fontWeight: '700' }}>VERIFIED (eKYC)</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, fontWeight: '600' }}>NID NUMBER</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>{signupData?.nidNumber || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, fontWeight: '600' }}>PHONE</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>{signupData?.phoneNumber}</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '100%', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color="#0066CC" />
          ) : (
            <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, fontWeight: '600' }}>
              Redirecting to Dashboard...
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
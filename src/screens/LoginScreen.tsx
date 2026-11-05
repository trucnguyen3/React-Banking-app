import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CleverTap = require('clevertap-react-native');

type Props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#222' : '#fff' };

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('abc');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }

    setLoading(true);

    try {
      // 1. Gọi API xác thực đăng nhập & lấy userId từ DB
      const response = await apiService.loginUser(identifier);

      if (response && response.success) {
        const userId = response.userId || identifier;
        const fullName = response.fullName || identifier;

        const userIdentifier = response.idCardNumber;

        // 2. Set Identity trên CleverTap
        CleverTap.onUserLogin({ 'Identity': userIdentifier });

        CleverTap.recordEvent('login_success', {
          'screen_id': 9,
          'screen_name': 'login',
          'user_id': userId,
        });

        // 3. Reset stack và truyền userId chuẩn từ DB vào MainTabs
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              params: {
                userId: userId,
                identifier: identifier,
                name: fullName,
              },
            },
          ],
        });

        await AsyncStorage.setItem('user_token', response.token);
      } else {
        Alert.alert('Login Failed', response?.message || 'Invalid credentials or user not found');
      }
    } catch (e: any) {
      console.error('Login Error:', e);
      Alert.alert('Login failed', e?.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[tw`flex-1 justify-center px-6`, backgroundStyle]}
    >
      <View style={tw`items-center mb-10`}>
        <FontAwesome name="credit-card" size={72} color="#0066CC" />
        <Text style={tw`text-2xl font-bold mt-4 text-gray-800`}>Welcome Back</Text>
        <Text style={tw`text-gray-500 mt-1`}>Login to your banking account</Text>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 mb-1`}>Email or Username</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
          placeholder="Enter your email or username"
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
        />
      </View>

      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-700 mb-1`}>Password</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3 text-gray-800`}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={tw`bg-blue-600 py-3 rounded-xl items-center`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-semibold`}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`mt-6`}
        onPress={() => navigation.navigate('PhoneInputScreen')}
      >
        <Text style={tw`text-center text-blue-600 text-base`}>
          Don’t have an account? <Text style={tw`font-bold`}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
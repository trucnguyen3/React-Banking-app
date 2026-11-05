import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { apiService } from '../services/api';
const CleverTap = require('clevertap-react-native');
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileScreenProps {
  navigation: any;
  route: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };
  const textColor = isDarkMode ? '#fff' : '#222';
  const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaa' : '#6b7280';

  // Nhận userId, identifier, name, signupData từ route.params
  const { userId, identifier, name, signupData } = route.params || {};

  const [username, setUsername] = useState(name || signupData?.fullName || identifier || 'Guest');
  const [mobile, setMobile] = useState(signupData?.phoneNumber || '0123456789');
  const [email, setEmail] = useState(signupData?.email || 'demo.acc@akadigital.vn');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushOptOut, setPushOptOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch dữ liệu mới nhất từ Database (`demo_app_users`) khi load màn hình
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userId) {
          const res = await apiService.getUserProfile(userId);
          if (res && res.success !== false) {
            setUsername(res.full_name || res.fullName || username);
            setMobile(res.phone_number || res.phoneNumber || mobile);
            setEmail(res.email || email);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Sử dụng apiService để cập nhật profile đồng bộ với hệ thống
      const data = await apiService.updateUserProfile({
        userId: userId,
        fullName: username,
        phoneNumber: mobile,
        email: email,
      });

      if (data.success) {
        setModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully in Database!');

        const props = {
          'Name': username,
          'Email': email,
          'Phone': mobile,
          'MSG-push': pushOptOut,
        };

        CleverTap.profileSet(props);
        CleverTap.recordEvent('profile_save_success', {
          'screen_id': 12,
          'screen_name': 'profile',
          'user_id': userId,
        });
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile.');
      }
    } catch (e) {
      console.error('Update profile error:', e);
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            CleverTap.recordEvent('account_delete_success', {
              'screen_id': 12,
              'screen_name': 'profile',
            });
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      // Gọi API logout thông qua apiService hoặc fetch nếu endpoint nằm ngoài service
      await fetch('https://api-uat1.akadigital.net/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      await AsyncStorage.removeItem('user_token');
    } catch (e) {
      console.log('Logout error:', e);
    }
  
    CleverTap.recordEvent('logout_success', {
      'screen_id': 12,
      'screen_name': 'profile',
    });

    // 2. Chỉ dùng navigation.reset để quay về Login, bỏ dòng navigate thừa bên dưới
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  if (loading) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, backgroundStyle]}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={[tw`flex-1 p-5 pt-12`, backgroundStyle]}>
      <Text style={[tw`text-2xl font-bold mb-6`, { color: textColor }]}>
        Profile
      </Text>

      {/* User Info Card */}
      <View style={[tw`rounded-2xl p-4 mb-6 shadow-sm`, { backgroundColor: cardBg }]}>
        <Text style={[tw`text-lg font-semibold mb-2`, { color: textColor }]}>
          {username}
        </Text>
        <Text style={{ color: subTextColor, marginBottom: 2 }}>{email}</Text>
        <Text style={{ color: subTextColor }}>{mobile}</Text>
      </View>

      {/* Settings Options */}
      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="cog" size={24} color="#0066CC" />
        <Text style={[tw`ml-3 text-base`, { color: textColor }]}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => Alert.alert('Support', 'Pretend calling successful.')}
      >
        <FontAwesome name="users" size={22} color="#0066CC" />
        <Text style={[tw`ml-3 text-base`, { color: textColor }]}>Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={handleDeleteAccount}
      >
        <FontAwesome name="trash-o" size={24} color="#FF3B30" />
        <Text style={tw`ml-3 text-base text-red-600`}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={handleLogout}
      >
        <FontAwesome name="sign-out" size={24} color="#FF3B30" />
        <Text style={tw`ml-3 text-base text-red-600`}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-5`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times-circle" size={24} color="#0066CC" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-gray-700 mb-1`}>Full Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-800`}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter name"
              placeholderTextColor="#999"
            />

            <Text style={tw`text-gray-700 mb-1`}>Mobile</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-800`}
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Text style={tw`text-gray-700 mb-1`}>Email</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-3 text-gray-800`}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View
              style={tw`flex-row items-center justify-between mt-2 mb-5 border-t border-gray-200 pt-3`}
            >
              <Text style={tw`text-gray-700 text-base`}>Push Notifications</Text>
              <Switch
                value={!pushOptOut}
                onValueChange={(val) => setPushOptOut(!val)}
                trackColor={{ false: '#ccc', true: '#0066CC' }}
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-600 py-3 rounded-xl mb-3 items-center`}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={tw`text-white text-center text-base font-semibold`}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
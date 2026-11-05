import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { apiService } from '../services/api'; // Đảm bảo đường dẫn import apiService đúng với project của bạn

const CleverTap = require('clevertap-react-native');

const DepositScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId, identifier, name } = route.params || {}; // Lấy thêm userId từ route.params

  const handleDeposit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid number.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User session not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      // Gọi API nạp tiền thật xuống Backend Node.js
      const response = await apiService.depositFunds({
        userId: userId,
        amount: value,
      });

      if (response.success) {
        Alert.alert(
          'Deposit Successful', 
          `You deposited ${value.toLocaleString()}đ successfully!\nNew Balance: ${parseFloat(response.newBalance).toLocaleString()}đ`
        );
        setAmount('');

        const casaLevel = value > 10000000 ? 'High' : 'Low';

        // Đẩy profile lên CleverTap SDK
        CleverTap.profileSet({
          'CASA Level': casaLevel,
        });

        // Bắn event sang CleverTap
        CleverTap.recordEvent('deposit_success', {
          'screen_id': 3,
          'screen_name': 'deposit',
          'amount': value,
          'new_balance': response.newBalance,
        });
      } else {
        Alert.alert('Deposit Failed', response.message || 'Could not process deposit.');
      }
    } catch (error) {
      console.error('Deposit API error:', error);
      Alert.alert('Error', 'Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16, paddingTop: 50, justifyContent: 'space-between' }}>
      {/* Top Section */}
      <View>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
          Deposit Funds
        </Text>

        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 text-base text-gray-800 bg-white mb-3`}
          keyboardType="numeric"
          placeholder="Enter amount (VNĐ)"
          placeholderTextColor="#999"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          onPress={handleDeposit}
          disabled={loading}
          style={{
            backgroundColor: '#0066CC',
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 12,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Deposit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { userId, identifier, name } })}
        style={{
          backgroundColor: '#0066CC',
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DepositScreen;
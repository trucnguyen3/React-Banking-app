import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import appsFlyer from 'react-native-appsflyer';
import { apiService } from '../services/api';
const CleverTap = require('clevertap-react-native');

interface PaymentsScreenProps {
  navigation: any;
  route: any;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';

  // Lấy userId từ phiên đăng nhập hiện tại
  const { userId } = route.params || {};

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!accountNumber || !amount) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }

    const numericAmount = parseFloat(amount) || 0;
    setLoading(true);

    try {
      // 1. Gọi Backend lưu giao dịch vào DB table `demo_app_transactions`
      const result = await apiService.createTransaction({
        userId: userId || 'GUEST_USER',
        transactionType: 'transfer',
        amount: numericAmount,
        recipientAccount: accountNumber,
        note: note,
      });

      if (result.success) {
        // 2. Phân nhánh bắn event dựa trên cờ `isFirstTransaction` từ DB trả về
        if (result.isFirstTransaction) {
          console.log('🎉 DB xác nhận đây là Giao dịch đầu tiên!');
        } else {
          console.log('Giao dịch thông thường (từ lần 2 trở đi)...');
          CleverTap.recordEvent('transfer_success', {
            amount: numericAmount,
            account_number: accountNumber,
            screen_id: 10,
          });
        }

        Alert.alert(
          'Transfer Successful 🎉',
          `You sent ${amount}₫ to ${accountNumber}`
        );

        setAccountNumber('');
        setAmount('');
        setNote('');
      } else {
        Alert.alert('Transaction Failed', result.message || 'Error processing transaction');
      }
    } catch (error) {
      console.error('Lỗi giao dịch:', error);
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5 pt-12`}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Payments & Transfers
      </Text>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>
          Recipient Account Number
        </Text>
        <View style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}>
          <FontAwesome name="id-card-o" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base text-gray-800`}
            placeholder="Enter account number"
            placeholderTextColor="#999"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Amount</Text>
        <View style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}>
          <FontAwesome name="money" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base text-gray-800`}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-6`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Note</Text>
        <View style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}>
          <FontAwesome name="comment-o" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base text-gray-800`}
            placeholder="Optional note"
            placeholderTextColor="#999"
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={loading}
        style={tw`bg-[#0066CC] py-4 rounded-2xl items-center shadow-md`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-lg font-semibold`}>Confirm Payment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentsScreen;
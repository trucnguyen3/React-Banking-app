import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { apiService } from '../services/api';
const CleverTap = require('clevertap-react-native');

interface BillItem {
  id: string;
  title: string;
  rawAmount: number; // Thêm số nguyên để tính toán trừ tiền chuẩn xác
  amount: string;
  date: string;
  icon: string;
  color: string;
}

const billPayments: BillItem[] = [
  { id: '1', title: 'Electricity Bill', rawAmount: 1200000, amount: '₫1,200,000', date: 'Oct 25, 2025', icon: 'bolt', color: '#F59E0B' },
  { id: '2', title: 'Water Bill', rawAmount: 420000, amount: '₫420,000', date: 'Oct 23, 2025', icon: 'tint', color: '#3B82F6' },
  { id: '3', title: 'Internet', rawAmount: 350000, amount: '₫350,000', date: 'Oct 18, 2025', icon: 'rss', color: '#10B981' },
];

const BillPaymentsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#F9FAFB';
  const cardBg = isDarkMode ? '#1e1e1e' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFF' : '#111827';
  const subTextColor = isDarkMode ? '#aaa' : '#6B7280';

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Nhận đủ userId, identifier, name từ params truyền sang
  const { userId, identifier, name } = route.params || {};

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePayAll = async () => {
    if (selected.length === 0) {
      Alert.alert('No bills selected', 'Please select at least one bill to pay.');
      return;
    }

    // Tính tổng số tiền của các hóa đơn được chọn
    const totalAmount = billPayments
      .filter((b) => selected.includes(b.id))
      .reduce((sum, item) => sum + item.rawAmount, 0);

    const selectedTitles = billPayments
      .filter((b) => selected.includes(b.id))
      .map((b) => b.title)
      .join(', ');

    setLoading(true);

    try {
      // Gọi API xuống Backend để trừ tiền ví và ghi nhận vào bảng demo_app_transactions
      const result = await apiService.createTransaction({
        userId: userId || 'GUEST_USER',
        transactionType: 'payment',
        amount: totalAmount,
        recipientAccount: 'EVN_WATER_NET',
        note: `Paid bills: ${selectedTitles}`,
      });

      if (result.success) {
          // Phân nhánh event CleverTap dựa theo cờ isFirstTransaction từ DB trả về
          if (result.isFirstTransaction) {
            console.log("OKE")
        } else {
          CleverTap.recordEvent('payment_success', {
            amount: totalAmount,
            screen_id: 0,
            screen_name: 'bill payment',
          });
        }

        Alert.alert('✅ Payment Successful', `Successfully paid: ${selectedTitles} (Total: ${totalAmount.toLocaleString('vi-VN')}₫)`);
        setSelected([]);
      } else {
        Alert.alert('Payment Failed', result.message || 'Insufficient balance or error processing payment.');
      }
    } catch (error) {
      console.error('Bill payment error:', error);
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: BillItem }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: cardBg,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: item.color + '25',
            marginRight: 16,
          }}
        >
          <FontAwesome name={item.icon} size={26} color={item.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>{item.title}</Text>
          <Text style={{ fontSize: 13, color: subTextColor, marginTop: 2 }}>{item.date}</Text>
        </View>

        <Text style={{ fontSize: 15, fontWeight: '700', color: textColor }}>{item.amount}</Text>

        {isSelected && (
          <FontAwesome
            name="check-circle"
            size={24}
            color="#10B981"
            style={{ marginLeft: 10 }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg, padding: 16, paddingTop: 50 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: textColor, marginBottom: 16 }}>
        My Payments
      </Text>

      <FlatList
        data={billPayments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={handlePayAll}
        disabled={loading}
        style={{
          backgroundColor: '#0066CC',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {selected.length > 0
              ? `Pay ${selected.length} Selected Bill${selected.length > 1 ? 's' : ''}`
              : 'Select Bills to Pay'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { userId, identifier, name }})}
        style={{
          backgroundColor: '#9CA3AF',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillPaymentsScreen;
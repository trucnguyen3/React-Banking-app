import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const CleverTap = require('clevertap-react-native');

interface HistoryItem {
  id: string;
  title: string;
  amount: string;
  date: string;
  icon: string;
  color: string;
}

const historyData: HistoryItem[] = [
  { id: '1', title: 'Coffee Shop', amount: '-₫75,000', date: 'Oct 26, 2025', icon: 'coffee', color: '#D97706' },
  { id: '2', title: 'Salary', amount: '+₫15,000,000', date: 'Oct 20, 2025', icon: 'money', color: '#16A34A' },
  { id: '3', title: 'Grocery Store', amount: '-₫560,000', date: 'Oct 18, 2025', icon: 'shopping-cart', color: '#2563EB' },
];

const HistoriesScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { identifier, name } = route.params || {};

  CleverTap.recordEvent(
    'payment_history', {
        'screen_id': 5,
        'screen_name': 'payment history'
  });

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{item.title}</Text>
        <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{item.date}</Text>
      </View>

      <Text
        style={[
          { fontSize: 15, fontWeight: '700' },
          { color: item.amount.startsWith('+') ? '#16A34A' : '#DC2626' },
        ]}
      >
        {item.amount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16, paddingTop: 50 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
        Transaction History
      </Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name } })}
        style={{
          backgroundColor: '#0066CC',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoriesScreen;
import React, { useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import appsFlyer from 'react-native-appsflyer';
import { Mixpanel } from 'mixpanel-react-native';
const CleverTap = require('clevertap-react-native');

interface InsightsScreenProps {
  navigation: any;
  route: any;
}

const fakeInsights = [
  { category: 'Food & Dining', amount: 3200000, color: '#FF8C00' },
  { category: 'Transportation', amount: 1800000, color: '#00BFFF' },
  { category: 'Shopping', amount: 2500000, color: '#FF69B4' },
  { category: 'Bills & Utilities', amount: 1400000, color: '#32CD32' },
  { category: 'Entertainment', amount: 900000, color: '#9370DB' },
];

const InsightsScreen: React.FC<InsightsScreenProps> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';
  const cardBg = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaa' : '#6b7280';

  const totalSpending = fakeInsights.reduce((sum, i) => sum + i.amount, 0);

  CleverTap.recordEvent(
    'insight_view', {
        'screen_id': 7,
        'screen_name': 'insight'
  });

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5 pt-12 pb-10`}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Spending Insights
      </Text>

      {/* Total Spending Card */}
      <View style={[tw`rounded-2xl p-5 shadow-sm mb-5`, { backgroundColor: cardBg }]}>
        <Text style={[tw`mb-2`, { color: subTextColor }]}>This Month's Total Spending</Text>
        <Text style={tw`text-3xl font-bold text-[#0066CC] mb-3`}>
          {totalSpending.toLocaleString('vi-VN')}₫
        </Text>
        <Text style={{ color: subTextColor }}>Compared to last month: +12%</Text>
      </View>

      {/* Category Breakdown Card */}
      <View style={[tw`rounded-2xl p-5 shadow-sm mb-5`, { backgroundColor: cardBg }]}>
        <Text style={[tw`text-lg font-semibold mb-4`, { color: textColor }]}>Category Breakdown</Text>
        {fakeInsights.map((item, index) => {
          const barWidth = (item.amount / totalSpending) * 100;
          return (
            <View key={index} style={tw`mb-4`}>
              <View style={tw`flex-row justify-between mb-1`}>
                <Text style={{ color: textColor }}>{item.category}</Text>
                <Text style={{ color: subTextColor }}>
                  {item.amount.toLocaleString('vi-VN')}₫
                </Text>
              </View>
              <View style={tw`w-full h-3 bg-gray-200 rounded-full`}>
                <View
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: 8,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Smart Tips Card */}
      <View style={[tw`rounded-2xl p-5 shadow-sm mb-5`, { backgroundColor: cardBg }]}>
        <Text style={[tw`text-lg font-semibold mb-4`, { color: textColor }]}>Smart Tips</Text>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="lightbulb-o" size={34} color="#FFD700" />
          <Text style={[tw`ml-3 flex-1`, { color: textColor }]}>
            You spent 30% more on Food this month — consider setting a meal
            budget next month.
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="home" size={22} color="#32CD32" />
          <Text style={[tw`ml-3 flex-1`, { color: textColor }]}>
            You could save ₫500,000/month by switching to digital bills.
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <FontAwesome name="credit-card" size={20} color="#0066CC" />
          <Text style={[tw`ml-3 flex-1`, { color: textColor }]}>
            Most shopping happens on weekends — plan big purchases earlier for
            cashback deals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default InsightsScreen;
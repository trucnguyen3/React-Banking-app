import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/HomeScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import type từ file navigation trong src/types/navigation
import { MainTabsParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TabNavigator = ({ route }: any) => {
  // Lấy thêm userId từ params tổng chuyển vào
  const { userId, identifier, name, signupData } = route.params || {};

  console.log("NAVIGATOR PARAMS: ", route.params);

  // Gom chung một gói params để truyền đồng bộ xuống các tab con
  const sharedParams = { userId, identifier, name, signupData };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 65, paddingBottom: 8, backgroundColor: '#fff' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Payments') iconName = 'money';
          else if (route.name === 'Insights') iconName = 'bar-chart';
          else if (route.name === 'Profile') iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={sharedParams} />
      <Tab.Screen name="Payments" component={PaymentsScreen} initialParams={sharedParams} />
      <Tab.Screen name="Insights" component={InsightsScreen} initialParams={sharedParams} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={sharedParams} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
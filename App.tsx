import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './src/types/navigation';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import PhoneInputScreen from './src/screens/PhoneInputScreen';
import OtpVerifyScreen from './src/screens/OtpVerifyScreen';
import FaceIdScreen from './src/screens/FaceIdScreen';
import SignupNidScreen from './src/screens/SignupNidScreen';
import SignupFormScreen from './src/screens/SignupFormScreen';
import ConfirmInfoScreen from './src/screens/ConfirmInfoScreen';
import WaitingReviewScreen from './src/screens/WaitingReviewScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import TabNavigator from './src/navigation/TabNavigator';
import BillPaymentsScreen from './src/screens/BillPaymentsScreen';
import HistoriesScreen from './src/screens/HistoriesScreen';
import DepositScreen from './src/screens/DepositScreen';
import CardApplyScreen from './src/screens/CardApplyScreen';
import CardOtpScreen from './src/screens/CardOtpScreen';
import CardFaceIdScreen from './src/screens/CardFaceIdScreen';
import CardConfirmInfoScreen from './src/screens/CardConfirmInfoScreen';
import CardReviewContractScreen from './src/screens/CardReviewContractScreen';
import CardSuccessScreen from './src/screens/CardSuccessScreen';
import CardScanNidScreen from './src/screens/CardScanNidScreen';
import CardConfirmNidScreen from './src/screens/CardConfirmNidScreen';

import appsFlyer from 'react-native-appsflyer';

const Stack = createNativeStackNavigator<RootStackParamList>();

appsFlyer.initSdk(
  {
    devKey: 'cYmtVpJCBSET23rRv4GWXa',
    isDebug: true,
    appId: '6754323492',
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
    //timeToWaitForATTUserAuthorization: 10,
  },
  (result) => {
      console.log('AppsFlyer SDK initialized:', result)
  },
  (error) => console.error('AppsFlyer error:', error)
);


const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PhoneInputScreen" component={PhoneInputScreen} />
        <Stack.Screen name="OtpVerifyScreen" component={OtpVerifyScreen} />
        <Stack.Screen name="FaceIdScreen" component={FaceIdScreen} />
        <Stack.Screen name='SignupNidScreen' component={SignupNidScreen} />
        <Stack.Screen name="SignupFormScreen" component={SignupFormScreen} />
        <Stack.Screen name="ConfirmInfoScreen" component={ConfirmInfoScreen} />
        <Stack.Screen name="WaitingReviewScreen" component={WaitingReviewScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="BillPaymentsScreen" component={BillPaymentsScreen} />
        <Stack.Screen name="HistoriesScreen" component={HistoriesScreen} />
        <Stack.Screen name="DepositScreen" component={DepositScreen} />
        <Stack.Screen name="CardApplyScreen" component={CardApplyScreen} />
        <Stack.Screen name="CardOtpScreen" component={CardOtpScreen} />
        <Stack.Screen name="CardFaceIdScreen" component={CardFaceIdScreen} />
        <Stack.Screen name="CardConfirmInfoScreen" component={CardConfirmInfoScreen} />
        <Stack.Screen name="CardReviewContractScreen" component={CardReviewContractScreen} />
        <Stack.Screen name="CardSuccessScreen" component={CardSuccessScreen} />
        <Stack.Screen name="CardScanNidScreen" component={CardScanNidScreen} />
        <Stack.Screen name="CardConfirmNidScreen" component={CardConfirmNidScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
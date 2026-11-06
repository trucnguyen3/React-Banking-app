import React, { useEffect } from 'react';
import { Linking } from 'react-native';

import { NavigationContainer, LinkingOptions, createNavigationContainerRef } from '@react-navigation/native';
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
const CleverTap = require('clevertap-react-native');

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

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'aka://banking',
    'https://uat1.akadigital.net',
  ],
  config: {
    screens: {
      WelcomeScreen: 'welcome',
      LoginScreen: 'login',
      PhoneInputScreen: 'phone-input',
      OtpVerifyScreen: 'otp-verify',
      FaceIdScreen: 'face-id',
      SignupNidScreen: 'signup-nid',
      SignupFormScreen: 'signup-form',
      ConfirmInfoScreen: 'confirm-info',
      WaitingReviewScreen: 'waiting-review',
      SuccessScreen: 'success',
      BillPaymentsScreen: 'bill-payments',
      HistoriesScreen: 'histories',
      DepositScreen: 'deposit',
      CardApplyScreen: 'card-apply',
      CardOtpScreen: 'card-otp',
      CardFaceIdScreen: 'card-face-id',
      CardConfirmInfoScreen: 'card-confirm-info',
      CardReviewContractScreen: 'card-review-contract',
      CardSuccessScreen: 'card-success',
      CardScanNidScreen: 'card-scan-nid',
      CardConfirmNidScreen: 'card-confirm-nid',
      MainTabs: {
        screens: {
          Home: 'home',
        },
      },
    },
  } as any, // Ép kiểu để bypass lỗi check type gắt gao của TypeScript với Tab Navigator
};

export const navigationRef = createNavigationContainerRef();

export function navigateWhenReady(screenName: string, params?: any) {
  const interval = setInterval(() => {
    if (navigationRef.isReady()) {
      clearInterval(interval);
      navigationRef.navigate(screenName as never, params as never);
    }
  }, 100); // Đợi tới khi Navigation Container sẵn sàng thì chuyển màn hình
}

const App: React.FC = () => {

  useEffect(() => {
    // Hàm xử lý chung khi lấy được deeplink từ push hoặc url
    const handleDeepLink = (deepLink?: string) => {
      if (!deepLink) return;
      console.log("🚀 Processing Deeplink:", deepLink);
      
      try {
        // Loại bỏ query params (nếu có) bằng cách cắt từ dấu '?'
        const cleanUrl = deepLink.split('?')[0];
        // Chia nhỏ đường dẫn theo dấu '/'
        const segments = cleanUrl.split('/').filter(Boolean); 
        // Lấy phần tử cuối cùng (ví dụ: CardApplyScreen hoặc card-apply)
        const targetScreen = segments[segments.length - 1];

        if (targetScreen) {
          console.log("🧭 Target Screen/Path:", targetScreen);
          
          // Map trực tiếp với màn hình tương ứng
          if (targetScreen.toLowerCase().includes('cardapply') || targetScreen.toLowerCase().includes('card-apply')) {
            navigateWhenReady('CardApplyScreen');
          }
          // Bạn có thể thêm các màn hình khác ở đây nếu cần
        }
      } catch (e) {
        console.error("❌ Error parsing DeepLink:", e);
      }
    };

    // 1. Lắng nghe khi app đang chạy (Foreground / Background)
    const pushListener = CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, (event: any) => {
      console.log("📥 Push Clicked Event:", event);
      const deepLink = event?.wzrk_dl || event?.pt_dl1 || event?.extras?.wzrk_dl;
      handleDeepLink(deepLink);
    });

    // 2. Xử lý trường hợp App bị KILL hoàn toàn (Cold Start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🚀 App opened from Killed state via Linking URL:", url);
        handleDeepLink(url);
      }
    }).catch(err => console.error("Error getting initial URL:", err));

    return () => {
      pushListener.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
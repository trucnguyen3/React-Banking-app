import { Platform, Linking } from 'react-native';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Switch,
  FlatList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import appsFlyer from 'react-native-appsflyer';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

type MainTabsParamList = {
  Home: undefined;
  Payments: undefined;
  Insights: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  BillPaymentsScreen: undefined;
  HistoriesScreen: undefined;
  DepositScreen: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
};

const os = Platform.OS;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation, onLogin }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#222' : '#fff' };

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('abc');

    const [referralCodeOnInstall, setReferralCodeOnInstall] = useState('');
    const [referralUserIdOnInstall, setReferralUserIdOnInstall] = useState('');

    const [referralCodeOnDeeplink, setReferralCodeOnDeeplink] = useState('');
    const [referralUserIdOnDeeplink, setReferralUserIdOnDeeplink] = useState('');

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

              appsFlyer.setOneLinkCustomDomains(["uat.akadigital.net"], (res) => {
                  console.log(res);
                    fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "setOneLinkCustomDomains",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
              }, (error) => {
                  console.log(error);
              });

    const handleLogin = async () => {
      if (!identifier || !password) {
        Alert.alert('Error', 'Please enter both email/username and password');
        return;
      }

      try {
        if (onLogin) {
          await onLogin({ identifier, password });
        } else {
          Alert.alert('Login', 'Pretend login successful (pass a real onLogin prop).');
        }

          const eventName = 'af_loginscreen';
          const eventValues = {
            af_screenid: '1',
            af_screenname: 'Login Screen',
            af_deeplink: 'LoginScreen',
          };

          appsFlyer.logEvent(
            eventName,
            eventValues,
            (res) => {
              console.log(eventName + ' triggered ' + res);
            },
            (err) => {
              console.error(err);
            }
          );

        appsFlyer.setCustomerUserId(identifier, (res) => {
          console.log('AppsFlyer ' + identifier + ' set:', res);
        });

        navigation.reset({
          index: 0,
          routes: [{
              name: 'MainTabs' ,
              params: { identifier }
          }],
        });
      } catch (e) {
        Alert.alert('Login failed', e?.message || 'Unknown error');
      }
    };

    appsFlyer.onAppOpenAttribution((res) => {
      console.log("onAppOpenAttribution: ", res);
    });

       appsFlyer.onInstallConversionData((res) => {
               console.log("onInstallConversionData: ", res)

               if (os === 'ios') {
                 console.log('Running on iOS');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "onInstallConversionData",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else if (os === 'android') {
                 console.log('Running on Android');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "onInstallConversionData",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else {
                 console.log('Running on another platform (e.g., web)');
               }

               if (res?.data.deep_link_value) {
                    const referralCode = res.data.referral_code || '';
                    const referralUserId = res.data.af_referrer_customer_id || '';

                    setReferralCodeOnInstall(referralCode);
                    setReferralUserIdOnInstall(referralUserId);

                    navigation.navigate(res.data.deep_link_value, {
                      referralCodeOnInstall: referralCode,
                      referralUserIdOnInstall: referralUserId,
                    });

                   const data_source_install = {
                       SOURCE: res.data.media_source,
                       CUSTOMER_TYPE: res.data.retargeting_conversion_type
                   };
               }
          });

/*
            const handleDeepLink = ({ url }) => {
              console.log('Received deep link outside:', url);
              if (url.includes('SignupScreen')) {
                console.log('Received deep link inside:', url);
                navigation.navigate('SignupScreen', {
                  referralCodeOnDeeplink,
                  referralUserIdOnDeeplink,
                });
              }
            };
*/
           useEffect(() => {
             Linking.getInitialURL().then((url) => {
               if (url) {
                   if (os === 'ios') {
                     console.log('Running on iOS');
                       fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                           os: os,
                           af_method: "getInitialURL",
                           data: url,
                         }),
                       })
                         .then(res => res.text())
                         .then(console.log)
                         .catch(console.error);
                   } else if (os === 'android') {
                     console.log('Running on Android');
                       fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({
                           os: os,
                           af_method: "getInitialURL",
                           data: url,
                         }),
                       })
                         .then(res => res.text())
                         .then(console.log)
                         .catch(console.error);
                   } else {
                     console.log('Running on another platform (e.g., web)');
                   }
                try {
                    const parsed = new URL(url);
                    const path = parsed.pathname.replace('/', '');
                    const screenName = path ? `${path}` : null;

                    const referralCodeOnDeeplink = parsed.searchParams.get('referral_code') || null;
                    const referralUserIdOnDeeplink = parsed.searchParams.get('af_referrer_customer_id') || null;

                    if (screenName) {
                      console.log('Navigating to:', screenName);
                      navigation.navigate(screenName, {
                        referralCodeOnDeeplink,
                        referralUserIdOnDeeplink,
                      });
                    } else {
                      console.warn('No screen name found in URL:', url);
                    }
                } catch (error) {
                    console.error('Invalid deep link URL:', url, error);
                }
               }
             });

             const listener = Linking.addEventListener('url', (event) => {
               if (os === 'ios') {
                 console.log('Running on iOS');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "Linking.addEventListener",
                       data: event,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else if (os === 'android') {
                 console.log('Running on Android');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "Linking.addEventListener",
                       data: event,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else {
                 console.log('Running on another platform (e.g., web)');
               }
             });

             return () => {
               listener.remove();
             };
           }, []);

        const onDeepLinkCanceller = appsFlyer.onDeepLink(res => {
               if (os === 'ios') {
                 console.log('Running on iOS');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "onDeepLink",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else if (os === 'android') {
                 console.log('Running on Android');
                   fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "onDeepLink",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
               } else {
                 console.log('Running on another platform (e.g., web)');
               }
          if (res?.deepLinkStatus !== 'NOT_FOUND') {
            console.log("onDeepLink: ", JSON.stringify(res?.data, null, 2));

            if (res?.data.deep_link_value) {
                const referralCode = res.data.referral_code || '';
                const referralUserId = res.data.af_referrer_customer_id || '';

                setReferralCodeOnDeeplink(referralCode);
                setReferralUserIdOnDeeplink(referralUserId);

                console.log('Navigating with referralCode:', referralCode);
                console.log('Navigating with referralUserId:', referralUserId);

                navigation.navigate(res.data.deep_link_value, {
                  referralCodeOnDeeplink: referralCode,
                  referralUserIdOnDeeplink: referralUserId,
                });
            }
          }
        })

   return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white justify-center px-6`}
    >
      <View style={tw`items-center mb-10`}>
        <FontAwesome name="credit-card" size={72} color="#0066CC" />
        <Text style={tw`text-2xl font-bold mt-4 text-gray-800`}>
          Welcome Back
        </Text>
        <Text style={tw`text-gray-500 mt-1`}>
          Login to your banking account
        </Text>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 mb-1`}>Email or Username</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="Enter your email or username"
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>

      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-700 mb-1`}>Password</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-blue-600 py-3 rounded-xl`}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Log In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`mt-6`}
        onPress={() => navigation.navigate("SignupScreen")}
      >
        <Text style={tw`text-center text-blue-600 text-base`}>
          Don’t have an account?{' '}
          <Text style={tw`font-bold`}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const SignupScreen: React.FC<{ route: any,  navigation: any }> = ({ route, navigation, onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('tructest@gmail.com');
  const [password, setPassword] = useState('123');

  const referralCodeOnInstall = route.params?.referralCodeOnInstall || '';
  const referralUserIdOnInstall = route.params?.referralUserIdOnInstall || '';

  const referralCodeOnDeeplink = route.params?.referralCodeOnDeeplink || '';
  const referralUserIdOnDeeplink = route.params?.referralUserIdOnDeeplink || '';

  const activeReferralCode = referralCodeOnDeeplink || referralCodeOnInstall || '';
  const activeReferralUserId = referralUserIdOnDeeplink || referralUserIdOnInstall || '';

  console.log("activeReferralCode", activeReferralCode)
  console.log("activeReferralUserId", activeReferralUserId)

            const eventName = 'af_signupscreen';
            const eventValues = {
              af_screenid: '2',
              af_screenname: 'Signup Screen',
              af_deeplink: 'SignupScreen',
            };

            appsFlyer.logEvent(
              eventName,
              eventValues,
              (res) => {
                console.log(eventName + ' triggered ' + res);
              },
              (err) => {
                console.error(err);
              }
            );

  const handleCopyReferral = () => {
      if (referralCode) {
          Clipboard.setString(referralCode);
          Alert.alert('Copied!', 'Referral code copied to clipboard.');
      }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      if (onSignup) {
        await onSignup({ name, email, password });
      } else {
        Alert.alert('Signup', 'Pretend signup successful (pass a real onSignup prop).');
      }

      appsFlyer.setCustomerUserId(name, (res) => {
        console.log('AppsFlyer ' + name + ' set:', res);
      });

      navigation.reset({
        index: 0,
        routes: [{
            name: 'MainTabs' ,
            params: { name }
        }],
      });
    } catch (e) {
      Alert.alert('Signup failed', e?.message || 'Unknown error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 justify-center items-center bg-white px-6`}
    >
      <Text style={tw`text-2xl font-bold text-blue-600 mb-6`}>Create Account</Text>

      {/* Name Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="person" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="email" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Field */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-6 w-full`}>
        <MaterialIcons name="lock" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2 text-base text-gray-800`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

        {activeReferralCode ? (
          <View style={tw`flex-row items-center mb-3`}>
            <Text style={tw`text-gray-700`}>
              Referral Code: <Text style={tw`font-bold text-blue-600`}>{activeReferralCode}</Text>
            </Text>
            <TouchableOpacity onPress={() => Clipboard.setString(activeReferralCode)} style={tw`ml-3`}>
              <FontAwesome name="clipboard" size={20} color="#0066CC" />
            </TouchableOpacity>
          </View>
        ) : null}

        {activeReferralUserId ? (
          <View style={tw`flex-row items-center mb-3`}>
            <Text style={tw`text-gray-700`}>
              Referral User ID: <Text style={tw`font-bold text-blue-600`}>{activeReferralUserId}</Text>
            </Text>
          </View>
        ) : null}

      {/* Signup Button */}
      <TouchableOpacity
        style={tw`bg-blue-600 rounded-lg w-full py-3`}
        onPress={handleSignup}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={tw`mt-4`}>
        <Text style={tw`text-gray-600`}>
          Already have an account? <Text style={tw`text-blue-600 font-semibold`}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const HomeScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };

  const [inviteLink, setInviteLink] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const notifications = [
    { id: '1', title: 'Transfer Successful', message: 'Your transfer of $250 was successful.', date: 'Oct 28, 2025' },
    { id: '2', title: 'Loan Payment Reminder', message: 'Your loan payment is due tomorrow.', date: 'Oct 29, 2025' },
    { id: '3', title: 'Security Update', message: 'We’ve updated our security policy for your safety.', date: 'Oct 27, 2025' },
  ];

    const ads = [
      {
        id: '1',
        image:
          'https://static.wixstatic.com/media/09c7dc_1d2f30ffb15d452ab8cd7b006339d86a~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_1d2f30ffb15d452ab8cd7b006339d86a~mv2.png',
        title: 'Save More with AKA Bank',
        desc: 'Earn up to 6% annual interest on savings.',
      },
      {
        id: '2',
        image:
          'https://static.wixstatic.com/media/09c7dc_1e453953e8a541e8824e16a4c5872c65~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_1e453953e8a541e8824e16a4c5872c65~mv2.png',
        title: 'Get Your Credit Card Today',
        desc: 'Apply now and enjoy cashback on every purchase.',
      },
      {
        id: '3',
        image:
          'https://static.wixstatic.com/media/09c7dc_0700649ea5ad4b359842b89939800ed8~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_0700649ea5ad4b359842b89939800ed8~mv2.png',
        title: 'Instant Loan Approvals',
        desc: 'Fast, paperless, and hassle-free personal loans.',
      },
    ];

  const handleCopyInvite = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');
    }
  };

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  // Track event
  const eventName = 'af_homescreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Home Screen',
    af_deeplink: 'HomeScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  // --- Notification Detail inline screen ---
  const NotificationDetailScreen = ({ notification }) => (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => setSelectedNotification(null)}>
          <FontAwesome name="times-circle" size={26} color="#0066CC" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold ml-3 text-gray-800`}>Notification Detail</Text>
      </View>
      <View style={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>{notification.title}</Text>
        <Text style={tw`text-gray-500 mb-4`}>{notification.date}</Text>
        <Text style={tw`text-base text-gray-700 leading-6`}>{notification.message}</Text>
      </View>
    </View>
  );

  // --- Main Home Content ---
  const renderHomeContent = () => (
    <>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-5 pt-6`}>
        <View>
          <Text style={tw`text-gray-500 text-base`}>Welcome back,</Text>
          <Text style={tw`text-2xl font-bold text-blue-700 mt-1`}>
            {displayUser}
          </Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={tw`relative`} onPress={() => setShowModal(true)}>
          <FontAwesome name="bell-o" size={30} color="#0066CC" />
          {notifications.length > 0 && (
            <View
              style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center`}
            >
              <Text style={tw`text-white text-xs font-bold`}>
                {notifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Scrollable body */}
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Account Card */}
        <LinearGradient
          colors={['#0052D4', '#4364F7', '#6FB1FC']}
          style={tw`mx-5 my-6 p-5 rounded-2xl shadow-md`}
        >
          <Text style={tw`text-white text-sm`}>Available Balance</Text>
          <Text style={tw`text-white text-3xl font-semibold mt-2`}>$25,480.92</Text>
          <View style={tw`flex-row justify-between mt-4`}>
            <Text style={tw`text-white/80`}>Account No:</Text>
            <Text style={tw`text-white font-medium`}>1234 5678 9001</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={tw`px-5`}>
          <Text style={tw`text-base font-semibold mb-3 text-gray-700`}>Quick Actions</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {/* Send Money */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('Payments')}
            >
              <FontAwesome name="money" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Send Money</Text>
            </TouchableOpacity>

            {/* Pay Bills */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('BillPaymentsScreen', { identifier, name })}
            >
              <FontAwesome name="list" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Pay Bills</Text>
            </TouchableOpacity>

            {/* Deposit */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('DepositScreen', { identifier, name })}
            >
              <FontAwesome name="get-pocket" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Deposit</Text>
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('HistoriesScreen', { identifier, name })}
            >
              <FontAwesome name="history" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Section */}
        <View style={tw`px-5 mt-6`}>
          <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>
            Invite Friends
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-600 py-3 rounded-xl`}
            onPress={() => {
              appsFlyer.setAppInviteOneLinkID('HkUB', (res) => {
                  console.log("setAppInviteOneLinkID: ", res)
                    fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       os: os,
                       af_method: "setAppInviteOneLinkID",
                       data: res,
                     }),
                   })
                     .then(res => res.text())
                     .then(console.log)
                     .catch(console.error);
              });
              appsFlyer.generateInviteLink(
                {
                  channel: 'AKA Banking Application',
                  campaign: 'AKA_Invite_App',
                  customerID: identifier,
                  brandDomain: 'uat.akadigital.net',
                  baseDeepLink: 'aka://banking/SignupScreen',
                  userParams: {
                    deep_link_value: 'SignupScreen',
                    org_id: 'AKA',
                    account_id: 'AKADIGITAL',
                    referral_code: '123456789',
                    af_force_deeplink: true
                  },
                },
                (link) => setInviteLink(link),
                (err) => console.log(err)
              );
            }}
          >
            <Text style={tw`text-white text-center text-base font-semibold`}>
              Generate Invite Link
            </Text>
          </TouchableOpacity>

          {inviteLink ? (
            <View style={tw`mt-3 bg-white p-3 rounded-xl shadow-sm flex-row items-center`}>
              <Text
                style={tw`text-blue-600 flex-1`}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {inviteLink}
              </Text>
              <TouchableOpacity onPress={handleCopyInvite}>
                <FontAwesome name="clipboard" size={22} color="#0066CC" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
{/* 🔥 Carousel Ads Section */}
          <View style={tw`mt-8`}>
            <Text style={tw`text-base font-semibold text-gray-700 px-5 mb-3`}>
              Latest Offers
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-5`}
            >
              {ads.map((ad) => (
                <TouchableOpacity
                  key={ad.id}
                  style={tw`mr-4 w-72 bg-white rounded-2xl shadow-md overflow-hidden`}
                >
                  <Image
                    source={{ uri: ad.image }}
                    style={tw`w-full h-40`}
                    resizeMode="cover"
                  />
                  <View style={tw`p-4`}>
                    <Text style={tw`text-lg font-bold text-gray-800`}>
                      {ad.title}
                    </Text>
                    <Text style={tw`text-gray-600 mt-1`}>{ad.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
      </ScrollView>

      {/* Notification Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-5 h-[60%] shadow-lg`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Notifications
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesome name="times-circle" size={24} color="#0066CC" />
              </TouchableOpacity>
            </View>

            {notifications.length > 0 ? (
              notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={tw`border-b border-gray-200 pb-3 mb-3`}
                  onPress={() => {
                    setShowModal(false);
                    setSelectedNotification(n);
                  }}
                >
                  <Text style={tw`text-base font-semibold text-gray-800`}>
                    {n.title}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`} numberOfLines={1}>
                    {n.message}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={tw`text-gray-500 text-center mt-10`}>
                No new notifications
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={[backgroundStyle, tw`flex-1`]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {selectedNotification ? (
        <NotificationDetailScreen notification={selectedNotification} />
      ) : (
        renderHomeContent()
      )}
    </SafeAreaView>
  );
};

const PaymentsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Log screen view
  const eventName = 'af_paymentsscreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Payments Screen',
    af_deeplink: 'PaymentsScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  const handleConfirm = () => {
    if (!accountNumber || !amount) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    Alert.alert(
      'Payment Successful 🎉',
      `You sent ${amount}₫ to ${accountNumber}`,
      [{ text: 'OK' }]
    );

    // You can later add API call or AppsFlyer event here
    appsFlyer.logEvent(
      'af_payment_success',
      { af_amount: amount, af_account: accountNumber },
      () => console.log('Payment success logged'),
      (err) => console.error(err)
    );

    // Reset form
    setAccountNumber('');
    setAmount('');
    setNote('');
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5`}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Payments & Transfers
      </Text>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>
          Recipient Account Number
        </Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="id-card-o" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Amount</Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="money" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-6`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Note</Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="comment-o" size={20} color="#0066CC" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Optional note"
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleConfirm}
        style={tw`bg-[#0066CC] py-4 rounded-2xl items-center shadow-md`}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const fakeInsights = [
  { category: 'Food & Dining', amount: 3200000, color: '#FF8C00' },
  { category: 'Transportation', amount: 1800000, color: '#00BFFF' },
  { category: 'Shopping', amount: 2500000, color: '#FF69B4' },
  { category: 'Bills & Utilities', amount: 1400000, color: '#32CD32' },
  { category: 'Entertainment', amount: 900000, color: '#9370DB' },
];

const InsightsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';

  // Track event
  const eventName = 'af_insightsscreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Insights Screen',
    af_deeplink: 'InsightsScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  const totalSpending = fakeInsights.reduce((sum, i) => sum + i.amount, 0);

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5`}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Spending Insights
      </Text>

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-gray-500 mb-2`}>This Month's Total Spending</Text>
        <Text style={tw`text-3xl font-bold text-[#0066CC] mb-3`}>
          {totalSpending.toLocaleString('vi-VN')}₫
        </Text>
        <Text style={tw`text-gray-500`}>Compared to last month: +12%</Text>
      </View>

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Category Breakdown</Text>
        {fakeInsights.map((item, index) => {
          const barWidth = (item.amount / totalSpending) * 100;
          return (
            <View key={index} style={tw`mb-4`}>
              <View style={tw`flex-row justify-between mb-1`}>
                <Text style={tw`text-gray-700`}>{item.category}</Text>
                <Text style={tw`text-gray-600`}>
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

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Smart Tips</Text>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="lightbulb-o" size={34} color="#FFD700" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            You spent 30% more on Food this month — consider setting a meal
            budget next month.
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="home" size={22} color="#32CD32" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            You could save ₫500,000/month by switching to digital bills.
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <FontAwesome name="credit-card" size={20} color="#0066CC" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            Most shopping happens on weekends — plan big purchases earlier for
            cashback deals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const ProfileScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };
  const textColor = isDarkMode ? '#fff' : '#222';

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  // Track event
  const eventName = 'af_profilescreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Profile Screen',
    af_deeplink: 'ProfileScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  // User Info State
  const [username, setUsername] = useState(displayUser);
  const [mobile, setMobile] = useState('0123456789');
  const [email, setEmail] = useState('truc.nguyen@akadigital.vn');
  const [pushOptOut, setPushOptOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(false);
    Alert.alert(
      'Profile Updated',
      `✅ Name: ${username}\n📱 Mobile: ${mobile}\n📧 Email: ${email}\n🔕 Push Opt-Out: ${pushOptOut ? 'Yes' : 'No'}`
    );
  };

  return (
    <View style={[tw`flex-1 p-5`, backgroundStyle]}>
      <Text style={[tw`text-2xl font-bold mb-6`, { color: textColor }]}>
        Profile
      </Text>

      {/* User Info Card */}
      <View style={tw`bg-white rounded-2xl p-4 mb-6 shadow-sm`}>
        <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
          {username}
        </Text>
        <Text style={tw`text-gray-600`}>{email}</Text>
        <Text style={tw`text-gray-600`}>{mobile}</Text>
      </View>

      {/* Settings */}
      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="cog" size={24} color="#0066CC" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => Alert.alert('Support', 'Pretend calling successful.')}
      >
        <FontAwesome name="users" size={22} color="#0066CC" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => navigation.navigate('LoginScreen')}
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
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter name"
            />

            <Text style={tw`text-gray-700 mb-1`}>Mobile</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <Text style={tw`text-gray-700 mb-1`}>Email</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
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
              style={tw`bg-blue-600 py-3 rounded-xl mb-3`}
              onPress={handleSave}
            >
              <Text style={tw`text-white text-center text-base font-semibold`}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const billPayments = [
  { id: '1', title: 'Electricity Bill', amount: '₫1,200,000', date: 'Oct 25, 2025', icon: 'bolt', color: '#F59E0B' },
  { id: '2', title: 'Water Bill', amount: '₫420,000', date: 'Oct 23, 2025', icon: 'tint', color: '#3B82F6' },
  { id: '3', title: 'Internet', amount: '₫350,000', date: 'Oct 18, 2025', icon: 'rss', color: '#10B981' },
];

const BillPaymentsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePayAll = () => {
    if (selected.length === 0) {
      Alert.alert('No bills selected', 'Please select at least one bill to pay.');
      return;
    }
    const selectedTitles = billPayments
      .filter((b) => selected.includes(b.id))
      .map((b) => b.title)
      .join(', ');
    Alert.alert('✅ Payment Successful', `Paid: ${selectedTitles}`);
    setSelected([]);
  };

  const handlePayOne = (item: any) => {
    Alert.alert('✅ Payment Successful', `Paid: ${item.title} (${item.amount})`);
    setSelected((prev) => prev.filter((x) => x !== item.id));
  };

  const renderItem = ({ item }) => {
      const isSelected = selected.includes(item.id);
    return (
        <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
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

          <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{item.amount}</Text>

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
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
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
        style={{
          backgroundColor: selected.length > 0 ? '#2563EB' : '#9CA3AF',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          {selected.length > 0
            ? `Pay ${selected.length} Selected Bill${selected.length > 1 ? 's' : ''}`
            : 'Select Bills to Pay'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name }})}
        style={{
          backgroundColor: '#0066CC',
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

const historyData = [
  { id: '1', title: 'Coffee Shop', amount: '-₫75,000', date: 'Oct 26, 2025', icon: 'coffee', color: '#D97706' },
  { id: '2', title: 'Salary', amount: '+₫15,000,000', date: 'Oct 20, 2025', icon: 'money', color: '#16A34A' },
  { id: '3', title: 'Grocery Store', amount: '-₫560,000', date: 'Oct 18, 2025', icon: 'shopping-cart', color: '#2563EB' },
];

const HistoriesScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";
  const renderItem = ({ item }) => (
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

          <Text style={[{ fontSize: 15, fontWeight: '700', color: '#111827' }, { color: item.amount.startsWith('+') ? '#16A34A' : '#DC2626' }]}>{item.amount}</Text>
        </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>Transaction History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name }})}
        style={{
          backgroundColor: '#0066CC',
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

const DepositScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  const handleDeposit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid number.');
      return;
    }
    Alert.alert('Deposit Successful', `You deposited ${value}đ!`);
    setAmount('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16, justifyContent: 'space-between' }}>
      {/* Top Section */}
      <View>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
          Deposit Funds
        </Text>

        <TextInput
          style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          onPress={handleDeposit}
          style={{
            backgroundColor: '#0066CC',
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Deposit
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name }})}
        style={{
          backgroundColor: '#0066CC',
          paddingVertical: 14,
          borderRadius: 12,
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

const TabNavigator = ({ route }: any) => {
    const { identifier, name } = route.params || {};
    return (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#0066CC',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        height: 65,
        paddingBottom: 8,
        borderTopWidth: 0.5,
        borderColor: '#ddd',
        backgroundColor: '#fff',
      },
      tabBarIcon: ({ color, size }) => {
        let iconName: string;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Payments') iconName = 'money';
        else if (route.name === 'Insights') iconName = 'bar-chart';
        else iconName = 'user';
        return <FontAwesome name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} initialParams={{ identifier, name }} />
    <Tab.Screen name="Payments" component={PaymentsScreen} />
    <Tab.Screen name="Insights" component={InsightsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ identifier, name }} />
  </Tab.Navigator>
)};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="BillPaymentsScreen" component={BillPaymentsScreen} />
        <Stack.Screen name="HistoriesScreen" component={HistoriesScreen} />
        <Stack.Screen name="DepositScreen" component={DepositScreen} />

        {/* Main app with bottom tabs */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
});

export default App;

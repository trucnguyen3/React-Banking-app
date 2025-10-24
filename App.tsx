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
  Alert
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
import appsFlyer from 'react-native-appsflyer';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Clipboard from '@react-native-clipboard/clipboard';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  HomeScreen: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
              name: 'HomeScreen' ,
              params: { identifier }
          }],
        });
      } catch (e) {
        Alert.alert('Login failed', e?.message || 'Unknown error');
      }
    };
       appsFlyer.onInstallConversionDataListener = (conversionData) => {
            console.log('Install Conversion Data:', conversionData);
       };


       // Example for uninstall detection
       appsFlyer.onUninstallListener = (uninstallData) => {
            console.log('Uninstall Data:', uninstallData);
       };

       appsFlyer.onInstallConversionData((res) => {
               console.log("AKA TEST CONVER: ", res)
               if (res?.data.deep_link_value) {
                    const referralCode = res.data.referral_code || '';
                    const referralUserId = res.data.af_referrer_customer_id || '';

                    setReferralCodeOnInstall(referralCode);
                    setReferralUserIdOnInstall(referralUserId);

                    console.log('Install referralCode:', referralCode);
                    console.log('Install referralUserId:', referralUserId);

                    navigation.navigate("SignupScreen", {
                      referralCodeOnInstall: referralCode,
                      referralUserIdOnInstall: referralUserId,
                    });

                   const data_source_install = {
                       SOURCE: res.data.media_source,
                       CUSTOMER_TYPE: res.data.retargeting_conversion_type
                   };
               }
          });

            const handleDeepLink = ({ url }) => {
              console.log('Received deep link outside:', url);

              // Ignore invalid or old cached URLs
              if (!url || !url.startsWith('aka://')) return;

              // Only handle when the deep link matches
              if (url.includes('/SignupScreen')) {
                console.log('Received deep link inside:', url);
                navigation.navigate('SignupScreen', {
                  referralCodeOnDeeplink,
                  referralUserIdOnDeeplink,
                });
              }
            };
    /*

           useEffect(() => {
             Linking.getInitialURL().then((url) => {
               if (url) {
                 handleDeepLink(url);
               }
             });

             const handleDeepLink = (url) => {
               console.log('Opened with URL:', url);
               // Parse and navigate
               if (url.includes('SignupScreen')) {
                 navigation.navigate('SignupScreen');
               }
             };

             const listener = Linking.addEventListener('url', (event) => {
               handleDeepLink(event.url);
             });

             return () => {
               listener.remove();
             };
           }, []);
    */
        const onDeepLink = (data: any) => {
          console.log('Deep Link Data:', data);

          if (data?.data.deep_link_value) {
            const referralCode = data.data.referral_code || '';
            const referralUserId = data.data.af_referrer_customer_id || '';

            setReferralCodeOnDeeplink(referralCode);
            setReferralUserIdOnDeeplink(referralUserId);

            console.log('Navigating with referralCode:', referralCode);
            console.log('Navigating with referralUserId:', referralUserId);

            navigation.navigate("SignupScreen", {
              referralCodeOnDeeplink: referralCode,
              referralUserIdOnDeeplink: referralUserId,
            });
          }
        };

          appsFlyer.onDeepLink(onDeepLink);

   return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white justify-center px-6`}
    >
      <View style={tw`items-center mb-10`}>
        <MaterialIcons name="account-balance" size={72} color="#0066CC" />
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

const SignupScreen: React.FC<{ route: any,  navigation: any }> = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const referralCodeOnInstall = route.params?.referralCodeOnInstall || '';
  const referralUserIdOnInstall = route.params?.referralUserIdOnInstall || '';

  const referralCodeOnDeeplink = route.params?.referralCodeOnDeeplink || '';
  const referralUserIdOnDeeplink = route.params?.referralUserIdOnDeeplink || '';

  const activeReferralCode = referralCodeOnDeeplink || referralCodeOnInstall || '';
  const activeReferralUserId = referralUserIdOnDeeplink || referralUserIdOnInstall || '';

  console.log("referralCodeOnInstall", referralCodeOnInstall)
    console.log("referralCodeOnInstall", referralCodeOnInstall)

      console.log("referralCodeOnDeeplink", referralCodeOnDeeplink)
        console.log("referralUserIdOnDeeplink", referralUserIdOnDeeplink)

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
              <MaterialIcons name="content-copy" size={20} color="#0066CC" />
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
  const backgroundStyle = { backgroundColor: isDarkMode ? '#222' : '#fff' };

  const [inviteLink, setInviteLink] = useState('');

  const handleCopyInvite = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');
    }
  };

  const { identifier } = route.params || {};

          const eventName = 'af_homescreen';
          const eventValues = {
            af_screenid: '0',
            af_screenname: 'Home Screen',
            af_deeplink: 'HomeScreen',
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

    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Welcome, {identifier}</Text>
            <View style={tw`mb-3`}>
              <Button
                title="Logout"
                onPress={() => navigation.navigate('LoginScreen')}
              />
            </View>

            <View style={tw`mt-2`}>
              <Button
                title="Invite User"
                onPress={() => {
                    appsFlyer.setAppInviteOneLinkID('pXhX', null);

                    // set the user invite params
                    appsFlyer.generateInviteLink(
                     {
                       channel: 'AKA Mobile Application',
                       campaign: 'AKA_Invite',
                       customerID: identifier,
                       brandDomain:'uat.akadigital.net',
                       baseDeepLink: 'aka://banking/SignupScreen',
                       userParams: {
                         deep_link_value : 'SignupScreen', // deep link param
                         deep_link_sub1 : '', // deep link param
                         org_id : 'AKA',
                         account_id: 'AKADIGITAL',
                         referral_code: '123456789'
                       },
                     },
                     (link) => {
                       console.log(link);
                       setInviteLink(link);
                     },
                     (err) => {
                       console.log(err);
                     }
                    );
                }}
              />
                {inviteLink ? (
                  <View style={tw`mt-4`}>
                    <View style={tw`flex-row items-center flex-wrap`}>
                      <Text style={tw`text-blue-600 text-base flex-shrink`}>
                        Invite Link: {inviteLink}
                      </Text>
                      <TouchableOpacity onPress={handleCopyInvite} style={tw`ml-3`}>
                        <MaterialIcons name="content-copy" size={20} color="#0066CC" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
});

export default App;

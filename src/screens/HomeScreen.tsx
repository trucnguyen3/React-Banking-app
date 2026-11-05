import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  useColorScheme,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import tw from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Clipboard from '@react-native-clipboard/clipboard';
import appsFlyer from 'react-native-appsflyer';
const CleverTap = require('clevertap-react-native');
import { apiService } from '../services/api';

interface HomeScreenProps {
  navigation: any;
  route: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };

  // Lấy params truyền vào từ navigation
  const { userId, identifier, name } = route.params || {};

  const [inviteLink, setInviteLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  // State cho số dư, danh sách thẻ và trạng thái loading
  const [balance, setBalance] = useState<number>(0);
  const [cards, setCards] = useState<any[]>([]); // State lưu danh sách thẻ đã apply
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  CleverTap.recordEvent('home_view', {
    screen_id: 6,
    screen_name: 'home',
  });

  // Hàm fetch số dư, profile và danh sách thẻ từ Database PostgreSQL
  const fetchHomeScreenData = async () => {
    if (!userId) return;
    try {
      setLoadingBalance(true);
      setLoadingCards(true);

      // 1. Gọi API lấy profile user
      const response = await apiService.getUserProfile(userId);
      if (response) {
        setUserInfo(response);
        if (response.balance !== undefined && response.balance !== null) {
          setBalance(parseFloat(response.balance));
        }
      }

      // 2. Gọi API lấy danh sách thẻ của user
      const cardsRes = await apiService.getUserCards(userId);
      if (cardsRes?.success && cardsRes.cards) {
        setCards(cardsRes.cards);
      }
    } catch (error) {
      console.error('Err fetching data on HomeScreen:', error);
    } finally {
      setLoadingBalance(false);
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchHomeScreenData();
  }, [userId, route.params?.refreshCards]);

  // Hàm kéo xuống làm mới trang (Pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeScreenData();
    setRefreshing(false);
  }, [userId]);

  const notifications = [
    { id: '1', title: 'Transfer Successful', message: 'Your transfer of $250 was successful.', date: 'Oct 28, 2025' },
    { id: '2', title: 'Loan Payment Reminder', message: 'Your loan payment is due tomorrow.', date: 'Oct 29, 2025' },
    { id: '3', title: 'Security Update', message: 'We’ve updated our security policy for your safety.', date: 'Oct 27, 2025' },
  ];

  const ads = [
    {
      id: '1',
      image: 'https://static.wixstatic.com/media/09c7dc_1d2f30ffb15d452ab8cd7b006339d86a~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_1d2f30ffb15d452ab8cd7b006339d86a~mv2.png',
      title: 'Save More with AKA Bank',
      desc: 'Earn up to 6% annual interest on savings.',
    },
    {
      id: '2',
      image: 'https://static.wixstatic.com/media/09c7dc_1e453953e8a541e8824e16a4c5872c65~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_1e453953e8a541e8824e16a4c5872c65~mv2.png',
      title: 'Get Your Credit Card Today',
      desc: 'Apply now and enjoy cashback on every purchase.',
    },
    {
      id: '3',
      image: 'https://static.wixstatic.com/media/09c7dc_0700649ea5ad4b359842b89939800ed8~mv2.png/v1/fill/w_286,h_371,al_c,q_95,enc_avif,quality_auto/09c7dc_0700649ea5ad4b359842b89939800ed8~mv2.png',
      title: 'Instant Loan Approvals',
      desc: 'Fast, paperless, and hassle-free personal loans.',
    },
  ];

  const handleCopyInvite = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');

      CleverTap.recordEvent('invite_click', {
        screen_id: 6,
        screen_name: 'home',
      });
    }
  };

  const displayUser = userInfo?.full_name || name || 'Guest';

  // --- Notification Detail inline screen ---
  const NotificationDetailScreen = ({ notification }: { notification: any }) => (
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
      <View style={tw`flex-row justify-between items-center px-5 pt-4`}>
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

      {/* Scrollable body với Pull-to-Refresh */}
      <ScrollView
        contentContainerStyle={tw`pb-10`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066CC']} />
        }
      >
        {/* THẺ TÀI KHOẢN THANH TOÁN GỐC */}
        <View style={tw`mx-5 my-5 px-5 py-4 rounded-3xl bg-blue-600 shadow-xl`}>
          <View style={tw`flex-row justify-between items-center mb-1`}>
            <Text style={tw`text-white/80 text-xs font-semibold tracking-wider uppercase`}>
              Available Balance
            </Text>
            {loadingBalance && <ActivityIndicator size="small" color="#fff" />}
          </View>

          <Text style={tw`text-white text-3xl font-extrabold tracking-tight mb-4`}>
            {balance.toLocaleString('vi-VN')} <Text style={tw`text-xl font-bold`}>đ</Text>
          </Text>

          <View style={tw`h-[1px] bg-white/20 mb-3`} />

          <View style={tw`flex-row justify-between items-center`}>
            <View>
              <Text style={tw`text-white/70 text-[11px] uppercase`}>Account No</Text>
              <Text style={tw`text-white text-base font-bold tracking-wide mt-0.5`}>
                {identifier || userInfo?.phone_number || '1234 5678 9001'}
              </Text>
            </View>

            <View style={tw`bg-white/20 p-2 rounded-full`}>
              <FontAwesome name="credit-card-alt" size={14} color="#fff" />
            </View>
          </View>
        </View>

        {/* KHU VỰC HIỂN THỊ CÁC THẺ ĐÃ APPLY (BÊN DƯỚI TÀI KHOẢN GỐC) */}
        <View style={tw`px-5 mb-5`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-base font-semibold text-gray-700`}>
              Card list ({cards.length})
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CardApplyScreen', { userId, identifier, name })}>
              <Text style={tw`text-blue-600 text-sm font-bold`}>+ Apply cards</Text>
            </TouchableOpacity>
          </View>

          {loadingCards ? (
            <ActivityIndicator color="#0066CC" style={{ marginVertical: 10 }} />
          ) : cards.length === 0 ? (
            <View style={tw`bg-white p-4 rounded-2xl shadow-sm items-center border border-gray-100`}>
              <FontAwesome name="credit-card" size={24} color="#ccc" style={{ marginBottom: 6 }} />
              <Text style={tw`text-gray-400 text-sm`}>You don't have any card</Text>
            </View>
          ) : (
            cards.map((card, index) => (
              <View
                key={card.card_id || index}
                style={tw`bg-[#161D2F] rounded-2xl p-4 mb-3 border border-blue-500/30 shadow-md`}
              >
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <View style={tw`flex-row items-center`}>
                    <FontAwesome name="credit-card-alt" size={16} color="#0066CC" style={{ marginRight: 8 }} />
                    <Text style={tw`text-white font-bold text-base`}>
                      {card.card_type}
                    </Text>
                  </View>
                  <Text style={tw`text-emerald-400 text-xs font-bold bg-emerald-500/15 px-2 py-0.5 rounded-md`}>
                    {card.status || 'ACTIVE'}
                  </Text>
                </View>

                <Text style={tw`text-white/90 text-sm font-semibold tracking-widest mb-2`}>
                  {card.card_number || '**** **** **** 1234'}
                </Text>

                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-white/50 text-xs`}>
                    Hạn thẻ: {card.expiry_date || '12/28'}
                  </Text>
                  <Text style={tw`text-white/50 text-xs`}>
                    {card.card_category || 'Credit Card'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={tw`px-5`}>
          <Text style={tw`text-base font-semibold mb-3 text-gray-700`}>Quick Actions</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {/* Send Money */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('Payments', { userId, identifier, name })}
            >
              <FontAwesome name="money" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Send Money</Text>
            </TouchableOpacity>

            {/* Pay Bills */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('BillPaymentsScreen', { userId, identifier, name })}
            >
              <FontAwesome name="list" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Pay Bills</Text>
            </TouchableOpacity>

            {/* Deposit */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('DepositScreen', { userId, identifier, name })}
            >
              <FontAwesome name="get-pocket" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Deposit</Text>
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('HistoriesScreen', { userId, identifier, name })}
            >
              <FontAwesome name="history" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>History</Text>
            </TouchableOpacity>

            {/* Apply Card */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('CardApplyScreen', { userId, identifier, name })}
            >
              <FontAwesome name="credit-card" size={26} color="#0066CC" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Apply Card</Text>
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
                console.log('setAppInviteOneLinkID: ', res);
              });
              appsFlyer.generateInviteLink(
                {
                  channel: 'AKA Banking Application',
                  campaign: 'AKA_Invite_App',
                  customerID: displayUser,
                  brandDomain: 'uat.akadigital.net',
                  baseDeepLink: 'aka://banking/SignupScreen',
                  userParams: {
                    deep_link_value: 'SignupScreen',
                    org_id: 'AKA',
                    account_id: 'AKADIGITAL',
                    referral_code: 'F59E0B',
                    af_sub1: 'C00134',
                    af_sub2: displayUser,
                    deep_link_sub2: '0066CC',
                    deep_link_sub3: displayUser,
                    af_force_deeplink: true,
                    af_dp: 'aka://banking/SignupScreen',
                    is_retargeting: true,
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

        {/* Carousel Ads Section */}
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

export default HomeScreen;
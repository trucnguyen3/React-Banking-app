import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabsParamList = {
  Home: { userId?: string; identifier?: string; name?: string; signupData?: any } | undefined;
  Payments: { userId?: string; identifier?: string; name?: string; signupData?: any } | undefined;
  Insights: { userId?: string; identifier?: string; name?: string; signupData?: any } | undefined;
  Profile: { userId?: string; identifier?: string; name?: string; signupData?: any } | undefined;
};

export type RootStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  PhoneInputScreen: undefined;
  OtpVerifyScreen: { phoneNumber: string };
  FaceIdScreen: { phoneNumber: string };
  SignupNidScreen: { phoneNumber: string };
  SignupFormScreen: { phoneNumber?: string; nidNumber?: string; [key: string]: any };
  ConfirmInfoScreen: { signupData: any };
  WaitingReviewScreen: { signupData: any };
  SuccessScreen: { name: string; signupData?: any };
  BillPaymentsScreen: { userId?: string; identifier?: string; name?: string } | undefined;
  HistoriesScreen: { userId?: string; identifier?: string; name?: string } | undefined;
  DepositScreen: { userId?: string; identifier?: string; name?: string } | undefined;
  CardApplyScreen: { userId?: string; identifier?: string; name?: string } | undefined;
  
  // Card Onboarding Flow Routes
  CardOtpScreen: { cardType: string; userId?: string; identifier?: string; name?: string };
  CardFaceIdScreen: { cardType: string; userId?: string; identifier?: string; name?: string };
  CardConfirmInfoScreen: { cardType: string; userId?: string; identifier?: string; name?: string };
  CardReviewContractScreen: { cardType: string; userId?: string; identifier?: string; name?: string; userInfo?: any };
  CardSuccessScreen: { cardType: string; userId?: string; identifier?: string; name?: string };

  CardScanNidScreen: { cardType: string; userId?: string; identifier?: string; name?: string };
  CardConfirmNidScreen: { cardType: string; nidNumber: string; userId?: string; identifier?: string; name?: string };

  MainTabs: { userId?: string; identifier?: string; name?: string; signupData?: any } | NavigatorScreenParams<MainTabsParamList> | undefined;
};
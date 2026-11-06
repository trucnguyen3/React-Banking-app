import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications
import CleverTapSDK
import CleverTapReact
import FirebaseCore

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?
  
  static var launchPushPayload: [AnyHashable: Any]? = nil

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    
    // 1. XỬ LÝ KHI APP BỊ KILL HOÀN TOÀN (COLD START) QUA PUSH
    if let remoteNotification = launchOptions?[.remoteNotification] as? [AnyHashable: Any] {
            print("📲 [AppDelegate] App launched from killed state via push: \(remoteNotification)")
            AppDelegate.launchPushPayload = remoteNotification
             
            let castedDict = remoteNotification as? [String: Any] ?? [:]
            
            // Gọi đúng tên hàm chuẩn của CleverTap SDK iOS
      CleverTap.sharedInstance()?.handleNotification(withData: castedDict)
            
            // Trích xuất wzrk_dl từ CleverTap payload
            var deepLinkString: String? = nil
            if let wzrkDl = castedDict["wzrk_dl"] as? String {
                deepLinkString = wzrkDl
            } else if let extras = castedDict["extras"] as? [String: Any], let wzrkDl = extras["wzrk_dl"] as? String {
                deepLinkString = wzrkDl
            }
            
            if let dl = deepLinkString, let url = URL(string: dl) {
                print("🔗 [AppDelegate] Found DeepLink in Killed State: \(dl)")
                
                // Đợi React Native bridge & Linking module sẵn sàng rồi mới bắn URL để mở app
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                    if UIApplication.shared.canOpenURL(url) {
                        // Thao tác này sẽ tự động kích hoạt ngược lại hàm application(_:open:options:)
                        // để chuyển tiếp qua RCTLinkingManager cho React Navigation xử lý
                        UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    }
                }
            }

            // Hiển thị Alert debug payload nếu cần thiết
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                let payloadString = "\(remoteNotification)"
                self.showPushAlert(title: "Push Payload (Killed App)", message: payloadString)
            }
    }
    
    FirebaseApp.configure()
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "aka_banking",
      in: window,
      launchOptions: launchOptions
    )
        
    CleverTap.setDebugLevel(CleverTapLogLevel.debug.rawValue + 1)
    CleverTap.autoIntegrate()
    CleverTapReactManager.sharedInstance()?.applicationDidLaunch(options: launchOptions)
    
    self.registerPush()
    
    // Gán delegate để nhận sự kiện thông báo
    UNUserNotificationCenter.current().delegate = self
    
    let action1 = UNNotificationAction(identifier: "action_1", title: "Back", options: [])
    let action2 = UNNotificationAction(identifier: "action_2", title: "Next", options: [])
    let action3 = UNNotificationAction(identifier: "action_3", title: "View In App", options: [])
    let category = UNNotificationCategory(identifier: "CTNotification", actions: [action1, action2, action3], intentIdentifiers: [], options: [])
            
    UNUserNotificationCenter.current().setNotificationCategories([category])
    

    return true
  }
  
  // 2. XỬ LÝ KHI USER BẤM VÀO PUSH LÚC APP ĐANG Ở FOREGROUND / BACKGROUND
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
      let userInfo = response.notification.request.content.userInfo as? [String: Any] ?? [:]
      print("📲 [AppDelegate] User clicked notification (Active/Background): \(userInfo)")
      
      // Báo cho CleverTap SDK xử lý
    CleverTap.sharedInstance()?.handleNotification(withData: userInfo)
      
      // Trích xuất và mở Deep Link
      var deepLinkString: String? = nil
      if let wzrkDl = userInfo["wzrk_dl"] as? String {
          deepLinkString = wzrkDl
      } else if let extras = userInfo["extras"] as? [String: Any], let wzrkDl = extras["wzrk_dl"] as? String {
          deepLinkString = wzrkDl
      }
      
      if let dl = deepLinkString, let url = URL(string: dl) {
          print("🔗 [AppDelegate] Opening DeepLink from background: \(dl)")
          DispatchQueue.main.async {
              if UIApplication.shared.canOpenURL(url) {
                  UIApplication.shared.open(url, options: [:], completionHandler: nil)
              }
          }
      }
      
      completionHandler()
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
      print("Push notification received in foreground.")
      completionHandler([.alert, .badge, .sound])
  }
  
  private func showPushAlert(title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default)
        alertController.addAction(okAction)
        
        if let rootVC = self.window?.rootViewController {
            rootVC.present(alertController, animated: true, completion: nil)
        }
    }
  
  private func registerPush() {
          let action1 = UNNotificationAction(identifier: "action_1", title: "Back", options: [])
          let action2 = UNNotificationAction(identifier: "action_2", title: "Next", options: [])
          let action3 = UNNotificationAction(identifier: "action_3", title: "View In App", options: [])
          let category = UNNotificationCategory(identifier: "CTNotification", actions: [action1, action2, action3], intentIdentifiers: [], options: [])
          UNUserNotificationCenter.current().setNotificationCategories([category])
          
          UNUserNotificationCenter.current().requestAuthorization(options: [.sound, .alert, .badge]) {
              (granted, error) in
              if (granted) {
                  DispatchQueue.main.async {
                      UIApplication.shared.registerForRemoteNotifications()
                  }
              }
          }
      }
      
      func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
          print("APPDELEGATE: open url \(url)")
          DispatchQueue.main.async {
              self.showAlert(message: "APPDELEGATE: open url \(url)")
          }
          return true
      }
      
      func open(_ url: URL, options: [String : Any] = [:],
                completionHandler completion: ((Bool) -> Swift.Void)? = nil){
          print("APPDELEGATE: open url \(url) with completionHandler")
          DispatchQueue.main.async {
              self.showAlert(message: "APPDELEGATE: open url \(url) with completionHandler")
          }
          completion?(false)
      }
      
      func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any]) {
          print("did receive remote notification \(userInfo)")
      }
      
      func showAlert(message:String) {
          let alertController = UIAlertController(title: "Deeplink", message: message, preferredStyle: .alert)
          let okAction = UIAlertAction(title: "OK", style: .default) { (result : UIAlertAction) -> Void in
              print("OK")
          }
          alertController.addAction(okAction)
          self.window?.rootViewController?.present(alertController, animated: true, completion: nil)
      }
      
      func applicationWillResignActive(_ application: UIApplication) {}
      func applicationDidEnterBackground(_ application: UIApplication) {}
      func applicationWillEnterForeground(_ application: UIApplication) {}
      func applicationDidBecomeActive(_ application: UIApplication) {}
      func applicationWillTerminate(_ application: UIApplication) {}
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

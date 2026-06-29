import CTNotificationContent
import CleverTapSDK

class NotificationViewController: CTNotificationViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
      
      let action1 = UNNotificationAction(identifier: "action_1", title: "Back", options: [])
      let action2 = UNNotificationAction(identifier: "action_2", title: "Next", options: [])
      let action3 = UNNotificationAction(identifier: "action_3", title: "View In App", options: [])
      
    }
    
    // optional: implement to get user event data
    override func userDidPerformAction(_ action: String, withProperties properties: [AnyHashable : Any]!) {
        print("userDidPerformAction \(action) with props \(String(describing: properties))")
    }
    
    // optional: implement to get notification response
    override func userDidReceive(_ response: UNNotificationResponse?) {
        print("Push Notification Payload \(String(describing: response?.notification.request.content.userInfo))")
        let notificationPayload = response?.notification.request.content.userInfo
        if (response?.actionIdentifier == "action_2") {
            CleverTap.sharedInstance()?.recordNotificationClickedEvent(withData: notificationPayload ?? "")
        }
    }
}

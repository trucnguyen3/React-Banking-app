import UserNotifications
import CTNotificationService

class NotificationService: CTNotificationServiceExtension {
    
    var contentHandler: ((UNNotificationContent) -> Void)?
    var bestAttemptContent: UNMutableNotificationContent?
    
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler
        self.bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        // MẸO KIỂM TRA: Thêm chữ này vào tiêu đề.
        // Nếu nhận push có chữ này nghĩa là NSE của bạn đã load code thành công!
        if let bestAttemptContent = self.bestAttemptContent {
            bestAttemptContent.title = "[NSE CHẠY] " + bestAttemptContent.title
        }
        
        // Gọi super để CleverTap tự động tải hình ảnh/video xuống
        super.didReceive(request, withContentHandler: { (contentToDeliver) in
            // Khi CleverTap xử lý xong (tải ảnh xong hoặc lỗi), trả kết quả về cho iOS hiển thị
            if let mutableContent = contentToDeliver.mutableCopy() as? UNMutableNotificationContent {
                // Giữ lại tiêu đề đã sửa đổi để test
                mutableContent.title = self.bestAttemptContent?.title ?? contentToDeliver.title
                contentHandler(mutableContent)
            } else {
                contentHandler(contentToDeliver)
            }
        })
    }
    
    // Hàm này cực kỳ quan trọng: Hệ điều hành gọi khi việc tải ảnh tốn quá nhiều thời gian (bị timeout)
    override func serviceExtensionTimeWillExpire() {
        if let contentHandler = contentHandler, let bestAttemptContent = bestAttemptContent {
            contentHandler(bestAttemptContent)
        }
    }
}

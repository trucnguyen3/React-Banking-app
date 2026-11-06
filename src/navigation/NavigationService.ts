import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  } else {
    // Đợi app load xong nếu vừa mở từ trạng thái tắt hẳn (Terminated)
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
      }
    }, 500);
  }
}
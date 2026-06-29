package com.aka_banking

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.clevertap.react.CleverTapApplication
import com.clevertap.android.sdk.ActivityLifecycleCallback
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapAPI.LogLevel
import com.google.firebase.messaging.FirebaseMessaging
import android.util.Log
import com.clevertap.android.sdk.interfaces.NotificationHandler
import com.clevertap.android.sdk.pushnotification.fcm.CTFcmMessageHandler
import com.clevertap.android.pushtemplates.PushTemplateNotificationHandler

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
      if (!task.isSuccessful) {
        Log.w("FCM_TAG", "Lấy token thất bại", task.exception)
        return@addOnCompleteListener
      }

      // Nhận token mới
      val token = task.result
      Log.d("FCM_TAG", "FCM Token: $token")
    }

    // Khai báo trong luồng khởi chạy để xóa token cũ
    CleverTapAPI.setNotificationHandler(PushTemplateNotificationHandler() as NotificationHandler);

    CleverTapAPI.setDebugLevel(LogLevel.VERBOSE)
  }
}

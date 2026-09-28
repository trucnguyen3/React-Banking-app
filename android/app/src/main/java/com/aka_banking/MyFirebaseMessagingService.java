package com.aka_banking;
import android.os.Bundle;
import android.util.Log;

import com.appsflyer.AppsFlyerLib;
import com.clevertap.android.sdk.CleverTapAPI;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;


public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "FCM-Service";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(TAG, "Message received!");

        // 2. Logic cũ của bạn cho AppsFlyer và Log hệ thống
        if(remoteMessage.getData().containsKey("af-uinstall-tracking")){
            return;
        } else {
            if (remoteMessage.getNotification() != null) {
                Log.d(TAG, "Notification Title: " + remoteMessage.getNotification().getTitle());
                Log.d(TAG, "Notification Body: " + remoteMessage.getNotification().getBody());
            }

            if (remoteMessage.getData().size() > 0) {
                Log.d(TAG, "Data Payload: " + remoteMessage.getData());
            }
        }
    }

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        Log.d(TAG, "New FCM Token: " + token);

        // Forward token sang cho AppsFlyer (Code cũ của bạn)
        AppsFlyerLib.getInstance().updateServerUninstallToken(getApplicationContext(), token);

    }
}
package com.satyamdorville.discover;
import android.content.res.Configuration;
import android.content.Intent;
import android.os.Bundle;
import com.reactnativenavigation.NavigationActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;


public class MainActivity extends NavigationActivity {

    // Added automatically by Expo Config
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        sendBroadcast(intent);
    }
    
    protected String getMainComponentName() {
        return "App"; // here
    }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);
  }


     protected ReactActivityDelegate createReactActivityDelegate() {
         return new ReactActivityDelegate(this, getMainComponentName()) {
             @Override
             protected ReactRootView createRootView() {
                 return new RNGestureHandlerEnabledRootView(MainActivity.this);
             }
         };
     }
}

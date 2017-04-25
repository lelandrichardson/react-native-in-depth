package com.reactnativechat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.Tracker;

public class GoogleAnalyticsBridge extends ReactContextBaseJavaModule {

  private Tracker mTracker;

  public GoogleAnalyticsBridge(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  synchronized public Tracker getDefaultTracker() {
    if (mTracker == null) {
      GoogleAnalytics analytics = GoogleAnalytics.getInstance(getReactApplicationContext());
      // To enable debug logging use: adb shell setprop log.tag.GAv4 DEBUG
      mTracker = analytics.newTracker(R.xml.global_tracker);
    }
    return mTracker;
  }

  @Override
  public String getName() {
    return "GoogleAnalyticsBridge";
  }

  synchronized GoogleAnalytics getAnalyticsInstance() {
    return GoogleAnalytics.getInstance(getReactApplicationContext());
  }

// Exercise:
// build a `screenView(String screenName)` method that utilizes google analytics screenview API
// https://developers.google.com/analytics/devguides/collection/android/v4/#activity-or-fragment


// Exercise:
// build a `setUser(String userName)` method that utilizes google analytics user tracking:
// https://developers.google.com/analytics/devguides/collection/android/v4/user-id#implementation

  @ReactMethod
  public void trackEvent(String category, String action, ReadableMap optionalValues) {
    Tracker tracker = getDefaultTracker();
    HitBuilders.EventBuilder builder = new HitBuilders.EventBuilder();

    builder.setCategory(category);
    builder.setAction(action);

     if (optionalValues.hasKey("label")) {
       builder.setLabel(optionalValues.getString("label"));
     }
     if (optionalValues.hasKey("value")) {
       builder.setValue(optionalValues.getInt("value"));
     }

    tracker.send(builder.build());
  }

}

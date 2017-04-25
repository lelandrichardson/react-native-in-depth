package com.reactnativechat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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

  @ReactMethod
  public void screenView(String screenName) {
    Tracker tracker = getDefaultTracker();
    tracker.setScreenName(screenName);
    tracker.send(new HitBuilders.ScreenViewBuilder().build());
  }

  @ReactMethod
  public void trackEvent(String category, String action, String label, Integer value) {
    Tracker tracker = getDefaultTracker();
    HitBuilders.EventBuilder builder = new HitBuilders.EventBuilder();

    builder.setCategory(category);
    builder.setAction(action);

    // if (optionalValues.hasKey("label")) {
    //   builder.setLabel(optionalValues.getString("label"));
    // }
    // if (optionalValues.hasKey("value")) {
    //   builder.setValue(optionalValues.getInt("value"));
    // }

    tracker.send(builder.build());
  }

  @ReactMethod
  public void setUser(String userId) {
    Tracker tracker = getDefaultTracker();
    tracker.set("&uid", userId);
  }

}

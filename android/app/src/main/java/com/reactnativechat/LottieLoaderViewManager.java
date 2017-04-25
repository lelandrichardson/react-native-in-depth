package com.reactnativechat;


import com.airbnb.lottie.LottieAnimationView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class LottieLoaderViewManager extends SimpleViewManager<LottieAnimationView> {

  private static final String REACT_CLASS = "LottieLoader";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public LottieAnimationView createViewInstance(ThemedReactContext context) {
    return new LottieAnimationView(context);
  }

  @ReactProp(name = "sourceName")
  public void setSourceName(LottieAnimationView view, String sourceName) {
    view.setAnimation(sourceName + ".json");
    view.loop(true);
    view.playAnimation();
  }

  // Exercise:
  // expose a `loop` boolean property that can toggle whether or not the animation loops

  // Exercise:
  // with `loop` false, see if you can figure out how to add an `onFinish` event
  // http://facebook.github.io/react-native/docs/native-components-android.html#events

}

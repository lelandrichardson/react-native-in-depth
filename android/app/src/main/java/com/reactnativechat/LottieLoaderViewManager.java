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
}

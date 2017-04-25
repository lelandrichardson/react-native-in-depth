package com.reactnativechat;


import com.airbnb.lottie.LottieAnimationView;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class LottieLoaderViewManager extends SimpleViewManager<LottieAnimationView> {

  private static final String REACT_CLASS = "LottieLoader";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public LottieAnimationView createViewInstance(ThemedReactContext context) {
    LottieAnimationView view = new LottieAnimationView(context);
    view.setAnimation("Lottie");
    view.loop(true);
    return view;
  }
}

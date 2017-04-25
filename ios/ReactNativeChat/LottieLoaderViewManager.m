//
//  LottieLoaderViewManager.m
//  ReactNativeChat
//
//  Created by Leland Richardson on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "LottieLoaderViewManager.h"

#import <React/RCTBridge.h>
#import <React/RCTView.h>
#import <React/RCTUIManager.h>
#import <Lottie/Lottie.h>
#import "LottieContainerView.h"

@implementation LottieLoaderViewManager {

}

RCT_EXPORT_MODULE(LottieLoader)

- (UIView *)view
{
  return [LottieContainerView new];
}

RCT_EXPORT_VIEW_PROPERTY(sourceName, NSString);

// Exercise:
// expose a `loop` boolean property that can toggle whether or not the animation loops

// Exercise:
// with `loop` false, see if you can figure out how to add an `onFinish` event
// http://facebook.github.io/react-native/docs/native-components-ios.html#events

@end

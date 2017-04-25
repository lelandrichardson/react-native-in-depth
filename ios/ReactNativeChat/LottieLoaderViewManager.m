//
//  LottieLoaderViewManager.m
//  ReactNativeChat
//
//  Created by Leland Richardson on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "LottieLoaderViewManager.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <Lottie/Lottie.h>

@implementation LottieLoaderViewManager {

}

RCT_EXPORT_MODULE(LottieLoader)

- (UIView *)view
{
  return [LOTAnimationView animationNamed:@"Watermelon"];
}

@end

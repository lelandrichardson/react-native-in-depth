//
//  LottieContainerView.h
//  ReactNativeChat
//
//  Created by Leland Richardson on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
#import <React/RCTView.h>
#import <Lottie/Lottie.h>

@interface LottieContainerView : RCTView

@property (nonatomic, strong) NSString *sourceName;

- (void)play;

@end

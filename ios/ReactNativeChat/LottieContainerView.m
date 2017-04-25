//
//  LottieContainerView.m
//  ReactNativeChat
//
//  Created by Leland Richardson on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
// import RCTView.h
#import "LottieContainerView.h"

#import <React/UIView+React.h>

@implementation LottieContainerView {
  LOTAnimationView *_animationView;
}

- (void)reactSetFrame:(CGRect)frame
{
  [super reactSetFrame:frame];
  if (_animationView != nil) {
    _animationView.frame = CGRectMake(0, 0, frame.size.width, frame.size.height);
  }
}

- (void)setSourceName:(NSString *)name {
  LOTAnimationView *next = [LOTAnimationView animationNamed:name];
  if (_animationView != nil) {
    [_animationView removeFromSuperview];
  }

  _animationView = next;
  _animationView.bounds = self.bounds;
  _animationView.loopAnimation = YES;
  [self addSubview: next];
  _animationView.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
  [self play];
}

- (void)play {
  if (_animationView != nil) {
    [_animationView play];
  }
}

@end

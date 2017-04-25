//
//  GoogleAnalyticsBridge.m
//  ReactNativeChat
//
//  Created by Leland Richardson on 4/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//
#import "GoogleAnalyticsBridge.h"
#import <React/RCTConvert.h>
#import <Google/Analytics.h>


@implementation GoogleAnalyticsBridge {

}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(screenView:(NSString *)screenName)
{
  id<GAITracker> tracker = [[GAI sharedInstance] defaultTracker];
  [tracker set:kGAIScreenName value:screenName];
  [tracker send:[[GAIDictionaryBuilder createScreenView] build]];
}

RCT_EXPORT_METHOD(trackEvent:(NSString *)category action:(NSString *)action label:(NSString *)label value:(NSNumber *)value)
{
  id<GAITracker> tracker = [[GAI sharedInstance] defaultTracker];
  [tracker send:[[GAIDictionaryBuilder createEventWithCategory:category
                                                        action:action
                                                         label:label
                                                         value:value] build]];
}

RCT_EXPORT_METHOD(setUser:(NSString *)user)
{
  id<GAITracker> tracker = [[GAI sharedInstance] defaultTracker];
  [tracker set:kGAIUserId value:user];
}

@end

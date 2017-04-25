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

// Exercise:
// build a `screenView(String screenName)` method that utilizes google analytics screenview API
// https://developers.google.com/analytics/devguides/collection/ios/v3/screens#manual


// Exercise:
// build a `setUser(String userName)` method that utilizes google analytics user tracking:
// https://developers.google.com/analytics/devguides/collection/ios/v3/user-id#implementation

RCT_EXPORT_METHOD(trackEvent:(NSString *)category action:(NSString *)action optionalValues:(NSDictionary *)optionalValues)
{
  id<GAITracker> tracker = [[GAI sharedInstance] defaultTracker];
  NSString *label = [RCTConvert NSString:optionalValues[@"label"]];
  NSNumber *value = [RCTConvert NSNumber:optionalValues[@"value"]];
  [tracker send:[[GAIDictionaryBuilder createEventWithCategory:category
                                                        action:action
                                                         label:label
                                                         value:value] build]];
}

@end

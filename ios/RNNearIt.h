/*
 * Copyright (c) 2017 Mattia Panzeri <mattia.panzeri93@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 #import <React/RCTBridgeModule.h>
 #import <React/RCTEventEmitter.h>
 #import <UserNotifications/UserNotifications.h>
 
 @interface RNNearIt : RCTEventEmitter <RCTBridgeModule>
 
 #if !TARGET_OS_TV
     + (void)didReceiveRemoteNotification:(NSDictionary* _Nonnull) userInfo;
     + (void)didReceiveLocalNotification:(UILocalNotification* _Nonnull) notification;
     + (void)didReceiveNotificationResponse:(UNNotificationResponse* _Nonnull) response withCompletionHandler:(void (^ _Nonnull)())completionHandler;
 #endif
 
 @end


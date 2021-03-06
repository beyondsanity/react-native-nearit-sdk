/*
 * Copyright (c) 2017 Mattia Panzeri <mattia.panzeri93@gmail.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// @flow
import { NativeEventEmitter, NativeModules } from 'react-native'

type NearItEvents = {
  SimpleNotification: string,
  Content: string,
  Feedback: string,
  Coupon: string,
  CustomJson: string
}

type NearItEventContent = {
  type: string,
  content: string,
  fromUserAction: string,
  trackingInfo: string
}

type NearItStatuses = {
  notified: string,
  engaged: string
}

type NearItConstants = {
  Events: NearItEvents,
  EventContent: NearItEventContent,
  Statuses: NearItStatuses
}

type NearItEvent = {
  'type': string
}

type NearItContentsListener = (event: NearItEvent) => void

type NearItImage = {
  'fullSize': ?string,
  'squareSize': ?string
}

type NearItCoupon = {
  'title': string,
  'description': string,
  'image': ?NearItImage,
  'value': string,
  'expiresAt': string,
  'redeemableFrom': string,
  'serial': ?string,
  'claimedAt': ?string,
  'redeemedAt': ?string
}

type NearItRating = 0 | 1 | 2 | 3 | 4 | 5

type EmitterSubscription = {
  remove(): void
}

const NearItSdk = NativeModules.RNNearIt

export class NearItManager {
  static constants: NearItConstants = {
    Events: NearItSdk.Events,
    EventContent: NearItSdk.EventContent,
    Statuses: NearItSdk.Statuses
  }

  static _eventSource = new NativeEventEmitter(NearItSdk)

  static addContentsListener (listener: NearItContentsListener): EmitterSubscription {
    const subscription = NearItManager._eventSource.addListener(NearItSdk.NativeEventsTopic, listener)
    NearItSdk.listenerRegistered()
    return subscription
  }

  static removeContentsListener (subscription: EmitterSubscription) {
    NearItSdk.listenerUnregistered()
      .then(res => {
        subscription.remove()
      })
  }

  static refreshConfig (): Promise<null> {
    return NearItSdk.refreshConfig()
  }

  static startRadar (): Promise<null> {
    return NearItSdk.startRadar()
  }

  static stopRadar (): Promise<null> {
    return NearItSdk.stopRadar()
  }

  static sendTracking (trackingInfo: string, status: string): Promise<null> {
    return NearItSdk.sendTracking(trackingInfo, status)
  }

  static sendFeedback (feedbackId: string, rating: NearItRating, comment: string = ''): Promise<null> {
    return NearItSdk.sendFeedback(feedbackId, rating, comment)
  }

  static getUserProfileId (): Promise<string> {
    return NearItSdk.getUserProfileId()
  }

  static setUserProfileId (profileId: string): Promise<string> {
    return NearItSdk.setUserProfileId(profileId)
  }

  static resetUserProfile (): Promise<null> {
    return NearItSdk.resetUserProfile()
  }

  static setUserData (userDataObject: { [string]: any }): Promise<null> {
    return NearItSdk.setUserData(userDataObject)
  }

  static requestNotificationPermission (): Promise<boolean> {
    return NearItSdk.requestNotificationPermission()
  }

  static requestLocationPermission (): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      const locationSubscription = NearItManager._eventSource.addListener(NearItSdk.NativePermissionsTopic, event => {
        if (event[NearItSdk.EventContent.type] === NearItSdk.Events.PermissionStatus) {
          if (event[NearItSdk.EventContent.status] === NearItSdk.Permissions.LocationGranted) {
            resolve(true)
          } else if (event[NearItSdk.EventContent.status] === NearItSdk.Permissions.LocationDenied) {
            resolve(false)
          }

          locationSubscription.remove()
        }
      })

      NearItSdk.requestLocationPermission()
        .then(locationGranted => {
          if (typeof (locationGranted) !== 'undefined' && locationGranted != null) {
            locationSubscription.remove()
            resolve(locationGranted)
          }
        })
    })
  }

  static getCoupons (): Promise<NearItCoupon[]> {
    return NearItSdk.getCoupons()
  }
}

export const constants = NearItManager.constants

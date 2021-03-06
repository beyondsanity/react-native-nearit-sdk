# Installation

Minimum Requirements:

- **React Native**: ***0.45.0+***
- **Android** Min SDK: ***16***
- **iOS** Min Platform: ***iOS 9***

To start using the SDK, add this plugin to your React Native project

```bash
$ yarn add react-native-nearit
```

and link it

```bash
$ react-native link react-native-nearit
```

<br>

## Android

To setup NearIT SDK for Android

### Dependency setup

In your project `android/build.gradle` make sure to include the following:
```java
buildscript {
    ...
    dependencies {
        ...
        classpath 'com.google.gms:google-services:3.1.0'
    }
}

allprojects {
    repositories {
        ...
        maven { url "https://maven.google.com" }
    }
}
```


In your project `android/app/build.gradle` make sure to include the following:
```java
android {
    compileSdkVersion 26
    buildToolsVersion "26.0.2"
    ...
}

...

apply plugin: 'com.google.gms.google-services' // Include at the end of file
```

### NearIT API Key
Add a new string resource to the Android resources to specify your API key

```xml
<resources>
    ...
    <string name="nearit_api_key" translatable="false">Your.API.Key</string>
    ...
</resources>
```
You can find your API key on [NearIT web interface](https://go.nearit.com/), under the "SDK Integration" section.

If you don't have a resources file, create a new `secrets.xml` file under your project `android/app/src/main/res/values` folder and add the previous line inside of it.

**N.B:** We suggests you to ignore this file from your versioning system.

<br>

## iOS
To setup NearIT SDK for iOS, you'll need `Cocoapods`.

### Cocoapod setup
Follow the instructions to install Cocoapods [here](https://guides.cocoapods.org/using/getting-started.html#getting-started), then initialize the `Podfile` inside your project `ios` folder.
```bash
$ cd ios
$ pod init
```

**NOTE:** The Podfile needs to be initialised in the `ios` directory of your project. Make sure to update cocoapods libs first by running `pod update`

### Dependency setup
Edit the created `Podfile` as follow:

- set `platform` to `9.0`
- add `Yoga` and `React` dependencies
- add `RNNearIt` as dependency

The resulting `Podfile` should look like the following
```ruby
# Uncomment the next line to define a global platform for your project
platform :ios, '9.0'

target '<your-project-main-target>' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for <your-project-main-target>
  pod 'Yoga', :path => '../node_modules/react-native/ReactCommon/yoga'
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'BatchedBridge', # Required For React Native 0.45.0+
    'Core',
    'DevSupport'
    # Add any other subspecs you want to use in your project
  ]
  
  # React Native NearIt plugin
  pod 'RNNearIt', :path => '../node_modules/react-native-nearit'

end

# Required to avoid build errors
post_install do |installer|
  installer.pods_project.targets.each do |target|
    if target.name == "React"
      target.remove_from_project
    end
  end
end
```

Run `pod install` to install the required dependencies

**N.B:** To update pod after updating `react-native-nearit` npm package, run `pod install --repo-update` inside your project `ios` folder


### NearIT API Key

Create the `NearIt.plist` file at `ios/<your app name>/NearIt.plist` to specify your API Key
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>API Key</key>
        <string>Your.API.Key</string>
    </dict>
</plist>
```

You can find your API key on [NearIT web interface](https://go.nearit.com/), under the "SDK Integration" section.


**N.B:** We suggests you to ignore this file from your versioning system.

<br>

## Usage ##

To interact with `NearIT` SDK from your React code use the `NearItManager` class exported by the `react-native-nearit` module
```js
import NearIT from 'react-native-nearit'
```

<br>

## Manual Configuration Refresh ##

The SDK **initialization is done automatically** and handles the task of syncing the recipes with our servers when your app starts up.
<br>
However, if you need to sync the recipes configuration more often, you can call this method:

```js
NearIT.refreshConfig();
```

This call return a [Promise](https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Promise) that is `resolved` as soon as the operation is completed successfully or `rejected` in case of errors.
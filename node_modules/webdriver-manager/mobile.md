Mobile Browser Support
======================

Support for mobile browsers is provided via [appium](https://github.com/appium/appium).  If you
have used `webdriver-manager update --android` or `webdriver-manager update --ios`, when you run
`webdriver-manager start`, Appium will automatically start on the port specified by `--appium-port`.


Android SDK
-----------

`webdriver-manager` will not install the android SDK by default.  If you want to test on android,
run `webdriver-manager update --android`.  This will download the android SDK, Appium, and set up
some virtual android devices for you to run tests against.  By default, this will create only an
android device running version 24 on x86-64.  If you need a different device, you must use the
`--android-api-levels` and `--android-abis` flags.  So you might run a command like this:

```
webdriver-manager update --android --android-api-levels 23 --android-abis armeabi-v7a
```

Valid values for the `--android-api-levels` flag are: `2`, `3`, `4`, `5`, ..., `24`

Valid values for the `--android-abi` flag are: `x86_64`, `armeabi-v7a`, `x86`, `mips`,
    `android-wear/x86_64`, `android-wear/armeabi-v7a`, `android-wear/x86`, `android-wear/mips`,
    `android-tv/x86_64`, `android-tv/armeabi-v7a`, `android-tv/x86`, `android-tv/mips`,
    `google_apis/x86_64`, `google_apis/armeabi-v7a`, `google_apis/x86`, `google_apis/mips`
 

As a practical matter, if you don't want to manually accept the license agreements, you can use
`--android-accept-licenses`, which will accept them on your behalf.

Once you have installed the Android SDK with the virtual devices you need, use
`webdriver-manager start --android` to boot up Appium and begin emulating your android device(s).
By default `webdriver-manager` will emulate all available android devices.  If you would rather
emulate a specific device, use `--avds`.  So you might use:

```
webdriver-manager start --android --avds android-23-default-x86_64
```

If you would prefer not to emulate any android virtual devices, use `--avds none`.

If you need to specify the ports used by the android virtual devices, use `--avd_port`.  The port
you specify will be used for the console of the first device, and the port one higher will be used
for its ADB.  The second device will use the next two ports, and so on.


iOS
---------

When you run `webdriver-manager update --ios`, `webdriver-manager` will install Appium and check
your computer for iOS simulation capabilities.  `webdriver-manager` cannot download the xcode
commandline tools for you however, nor can it agree to Apple's user agreement.  The xcode
commandline tools come with several virtual devices pre-setup.  If you need more, run
`xcrun simctl` for help doing that.

Once you have installed Appium, `webdriver-manager` will launch it automatically when you run
`webdriver-manager start`.  Appium will automatically handle starting iOS device emulation as
needed.

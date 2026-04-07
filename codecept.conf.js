exports.config = {
  tests: './tests/*_test.js',
  output: './output',

helpers: {
  Appium: {
    app: 'C:/Users/maran/sauce-demo-tests/apps/mda-2.2.0-25.apk',

    platform: 'Android',
    deviceName: 'emulator-5554',
    automationName: 'UiAutomator2',

    appPackage: 'com.saucelabs.mydemoapp.android',
    appActivity: 'com.saucelabs.mydemoapp.android.view.activities.MainActivity',
    appWaitActivity: 'com.saucelabs.mydemoapp.android.view.activities.*',
    appWaitForLaunch: false,
    appWaitDuration: 60000,
    adbExecTimeout: 60000,

    noReset: true,
    fullReset: false,
    dontStopAppOnReset: true,
    newCommandTimeout: 300,

    host: '127.0.0.1',
    port: 4723,
    path: '/wd/hub'
  }
},

  include: {
    I: './steps_file.js'
  },

  name: 'sauce-demo-tests'
};
const path = require('path');

// Defaults match a local Pixel 5 emulator on Android 11 (API 30).
// Set DEVICE_NAME / PLATFORM_VERSION to run on something else.
exports.config = {
  tests: './tests/*_test.js',
  output: './output',

  helpers: {
    Appium: {
      app: path.resolve(__dirname, 'apps/mda-2.2.0-25.apk'),
      platform: 'Android',
      // CodeceptJS only passes these to Appium when they sit under desiredCapabilities.
      desiredCapabilities: {
        deviceName: process.env.DEVICE_NAME || 'emulator-5554',
        platformVersion: process.env.PLATFORM_VERSION || '11',
        automationName: 'UiAutomator2',
        appPackage: 'com.saucelabs.mydemoapp.android',
        appActivity: 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity',
        // the splash screen closes fast, so accept any screen of the app
        appWaitActivity: 'com.saucelabs.mydemoapp.android.view.activities.*',
        appWaitDuration: 60000,
        adbExecTimeout: 60000,
        androidInstallTimeout: 90000,
        uiautomator2ServerInstallTimeout: 120000,
        newCommandTimeout: 300,
        noReset: false,
        fullReset: false
      },
      host: '127.0.0.1',
      port: 4723,
      path: '/wd/hub'
    }
  },

  plugins: {
    screenshotOnFail: { enabled: true }
  },

  // Used by "npm run test:report": steps in the console plus an HTML report in output/.
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      mochawesome: {
        stdout: './output/console.log',
        options: { reportDir: './output', reportFilename: 'report' }
      }
    }
  },

  include: {
    I: './steps_file.js'
  },

  name: 'sauce-demo-tests'
};

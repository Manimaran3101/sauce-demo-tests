# Sauce Labs Demo App - Android tests

[![Android tests](https://github.com/Manimaran3101/sauce-demo-tests/actions/workflows/tests.yml/badge.svg)](https://github.com/Manimaran3101/sauce-demo-tests/actions/workflows/tests.yml)

A small mobile test suite I wrote for the Sauce Labs **My Demo App** on Android
([v2.2.0](https://github.com/saucelabs/my-demo-app-android/releases/tag/2.2.0)).
It uses CodeceptJS with Appium (UiAutomator2) and covers login and checkout.

My other repos are Playwright web projects. This one is my mobile example.

## What is tested

| Test file | Scenario |
| --- | --- |
| `tests/login_test.js` | Standard user logs in and sees the Products screen |
| `tests/login_test.js` | Locked out user gets an error message |
| `tests/checkout_test.js` | Add a product, enter address and payment, place the order, see "Thank you" |
| `tests/checkout_validation_negative_test.js` | Submitting an empty address form shows "Please provide your full name." |

## How to run it locally

You need Node.js 22, a JDK (17 or newer, with `JAVA_HOME` set), the Android SDK and an
emulator running Android 11 (API 30). I use a Pixel 5 image.

```bash
npm install
npm install -g appium@1.22.3
```

Download `mda-2.2.0-25.apk` from the
[2.2.0 release](https://github.com/saucelabs/my-demo-app-android/releases/tag/2.2.0)
and put it in `apps/`.

Start the emulator, then start Appium in a second terminal:

```bash
appium --base-path /wd/hub
```

On Windows, start Appium from PowerShell or cmd. Git Bash turns `/wd/hub` into a Windows path.

Run the tests:

```bash
npm test
```

`npm run test:report` does the same and also writes an HTML report to `output/report.html`.
Screenshots of failed tests also go to `output/`.

The device defaults to `emulator-5554` on Android 11. To use another device, set
`DEVICE_NAME` and `PLATFORM_VERSION`.

## CI

GitHub Actions starts an Android 11 emulator, downloads the APK, starts Appium and runs
all tests on every push and pull request. The HTML report, failure screenshots and the
Appium log are uploaded as the `test-report` artifact.

## Project layout

```
tests/      test files
pages/      CommonPage.js, the selectors and actions for each screen
helpers/    popup and keyboard helpers
data/       test users, address and card data
apps/       the APK (not in git)
output/     report and screenshots (not in git)
```

## Things I found about the app

- **Login accepts any username and password.** Only `alice@example.com` is blocked as
  locked out. That is why the negative login test uses the locked out user and not
  random wrong credentials.
- **The app works fully offline.** Products, cart and checkout have no backend, so I did
  not write network tests. They would pass with or without a connection.
- **Checkout only checks that required fields are filled in.** The name field accepts
  numbers and the card fields accept anything, so I only test the empty form case.

## Problems I hit and how I fixed them

- The bottom buttons ("Add To Cart", "To Payment") were covered by the keyboard or only
  partly on screen. Now the tests close the keyboard, scroll the button into view with
  `UiScrollable`, and use `click`, which presses the visible part of the element.
- My first config put the Appium settings at the top level of the helper config.
  CodeceptJS ignores them there, so only the APK path reached Appium. They are now under
  `desiredCapabilities`.

## Test accounts

These come from the app's own login screen.

| Username | Password | Result |
| --- | --- | --- |
| bod@example.com | 10203040 | Logs in |
| alice@example.com | 10203040 | Locked out |

## Author

Manimaran Murugan
maran.jan31@gmail.com

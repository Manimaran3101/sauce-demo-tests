# Mobile Automation Framework — Sauce Labs Demo App

## Overview

This framework automates key user journeys on the Sauce Labs Demo Android app using **CodeceptJS** with **Appium** (UIAutomator2). It is designed to be readable, maintainable, and extensible — with a structure that junior engineers can follow and contribute to.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| CodeceptJS | 3.5.4 | Test framework |
| Appium | 1.22.3 | Mobile automation server |
| WebdriverIO | 7.25.0 | WebDriver client |
| UIAutomator2 | Built-in | Android automation engine |
| Node.js | 22.x | Runtime |

---

## Prerequisites

Before running tests, ensure the following are installed and configured:

- Node.js v16 or higher
- Java JDK 17
- Android Studio with Android SDK
- Appium 1.22.3 (`npm install -g appium@1.22.3`)
- Android Emulator (Pixel 5, API 30 recommended)
- ADB added to system PATH
- ANDROID_HOME environment variable set

---

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/Manimaran3101/sauce-demo-tests.git
cd sauce-demo-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download the Sauce Labs Demo App

Download the APK from:
```
https://github.com/saucelabs/my-demo-app-android/releases
```

Place it in:
```
apps/mda-2.2.0-25.apk
```

### 4. Install the app on emulator

Start your Android emulator first, then:

```bash
adb install apps/mda-2.2.0-25.apk
```

### 5. Start Appium server

```bash
appium --base-path /wd/hub
```

Keep this running in a separate terminal window.

### 6. Run all tests

```bash
npx codeceptjs run --steps
```

Run a specific test file:

```bash
npx codeceptjs run tests/login_test.js --steps
```

---

## Device and Emulator Requirements

| Setting | Value |
|---|---|
| Platform | Android |
| Recommended API | 30 (Android 11) |
| Device | Pixel 5 |
| Automation Engine | UIAutomator2 |
| Appium Server | localhost:4723 |

Before running tests, ensure the emulator is fully booted and showing the home screen. Wait for the status bar clock to appear before starting Appium or running tests.

---

## Project Structure

```
sauce-demo-tests/
├── tests/
│   ├── login_test.js
│   ├── checkout_test.js
│   └── checkout_validation_negative_test.js
├── pages/
│   └── CommonPage.js
├── helpers/
│   └── appHelper.js
├── apps/                 ← APK file (gitignored)
├── output/               ← screenshots (gitignored)
├── codecept.conf.js
├── package.json
└── README.md
```

---

## Test Scenarios

### Login (`tests/login_test.js`)

| Scenario | Type | Expected Result |
|---|---|---|
| Successful login with valid credentials | Happy path | Products page displayed |
| Locked out user cannot login | Negative | Error message displayed |

### Checkout Flow (`tests/checkout_test.js`)

| Scenario | Type | Expected Result |
|---|---|---|
| User can complete checkout successfully | Happy path | Thank you confirmation displayed |

### Checkout Validation (`tests/checkout_validation_negative_test.js`)

| Scenario | Type | Expected Result |
|---|---|---|
| User cannot proceed without entering required details | Negative | Validation error displayed, stays on address page |

---

## Test Strategy

### What We Automate and Why

We automate scenarios that meet all three criteria:

1. **High frequency** — tested on every release
2. **High risk** — direct user impact if broken
3. **Stable** — feature is mature, not changing every sprint

#### Automated — with specific reasoning for this app

| Scenario | Why Automated |
|---|---|
| Login with valid credentials | Entry point to all features — if this breaks, nothing works. High frequency, high risk. |
| Locked out user error | Security-adjacent behaviour — must be verified on every release, stable and predictable. |
| Full checkout flow | Revenue-critical path — any regression here directly impacts business. |
| Empty form submission | Regression-prone validation — developers frequently break this accidentally when modifying forms. |

#### Not Automated — with specific reasoning for this app

| Scenario | Why Not Automated |
|---|---|
| Network interruption during checkout | The demo app works fully offline and does not make real network calls — there is no network layer to interrupt. A test simulating network loss would pass regardless of connection state and give false confidence. |
| Input format validation | The app has no format validation — name field accepts numbers, expiry accepts any string. Automating against non-existent rules would produce meaningless results. |
| Visual layout testing | Requires dedicated visual diffing tools such as Applitools. Out of scope for this framework. |
| Biometric authentication | Cannot be reliably simulated on an emulator. Requires real device testing. |

---

## App Behaviour Findings

During framework development, exploratory testing revealed the following characteristics of the demo app. These directly influenced automation decisions and are documented here for full transparency.

### Finding 1 — Authentication accepts any credentials
**Observation:** The login screen accepts any username and password combination and logs the user in successfully. Only two exceptions exist — `alice@example.com` which is explicitly locked out, and the visual user account.

**Impact on automation:** The negative login test uses the locked out account rather than invalid credentials, since invalid credentials would incorrectly result in a successful login on this app.

### Finding 2 — App operates fully offline
**Observation:** The app functions completely without a network connection. All product data, cart state, and checkout flows work offline with no backend dependency.

**Impact on automation:** Network interruption testing was not implemented because there is no network layer to interrupt. A test simulating network loss would pass regardless of connection state and provide false coverage.

### Finding 3 — Input fields have partial validation
**Observation:** Required fields are validated on form submission — submitting an empty form shows error messages such as "Please provide your full name." However, there is no format validation — the name field accepts numbers, the card expiry field accepts any string, and the card number field accepts any length.

**Impact on automation:** Validation tests are scoped to verifying that empty required fields prevent form submission. Format-specific tests were not added as no format rules are enforced.

---

## Framework Architecture

### Page Object Pattern
All locators and page-specific actions are encapsulated in `pages/CommonPage.js`. Tests never contain raw selectors — they call page methods instead. When a UI element changes, only one file needs updating.

### Shared Helpers
`helpers/appHelper.js` contains the `dismissPopup` function which handles the Android compatibility popup that appears on app launch. It attempts to find and dismiss the popup within 3 seconds and silently continues if the popup is not present — making tests resilient across different Android API levels.

### Selector Strategy
Three selector types are used across the framework. `android=new UiSelector().resourceId()` is used for all interactive elements such as buttons and input fields — resource IDs are stable and directly tied to the app's element identifiers. `android=new UiSelector().description()` is used for accessibility-based selectors such as menu items. `android=new UiSelector().text()` and `textContains()` are used for assertions — verifying visible text, success messages, and error messages on screen.

### Synchronisation
Explicit waits (`waitForElement`) are used throughout — never hardcoded sleep timers except where a brief stabilisation pause is required after a screen transition. Each step waits for its target element to be present before interacting.

---

## CI/CD Integration

The framework is designed to integrate with CI pipelines. The example below shows the pipeline structure using GitHub Actions. In production, the local emulator setup would be replaced with a cloud device farm such as BrowserStack or Sauce Labs Real Devices, which provide Android devices accessible over the internet.

```yaml
name: Mobile Automation Tests

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm install
      - name: Start Appium
        run: appium --base-path /wd/hub &
      - name: Run tests
        run: npx codeceptjs run --steps
```

**Quality gates:**
- Smoke suite (login tests) — runs on every pull request
- Full regression — runs on merge to main
- Tests must pass before merge is permitted

---

## What I Would Add Next

Given more time, the next priorities would be:

1. **iOS platform configuration** — add XCUITest driver config and iOS-specific capabilities. Test logic in `tests/` and `pages/` would remain unchanged — only the configuration layer differs.
2. **Cloud device farm integration** — connect to BrowserStack or Sauce Labs for broader device coverage across manufacturers and API levels.
3. **CI/CD pipeline** — integrate with GitHub Actions using a cloud device provider to run tests automatically on every pull request.
4. **Test reporting** — add Allure reports for visual test results, history tracking, and flakiness detection.
5. **Network interruption tests** — when connected to a real VPN backend, simulate connection drops during critical flows to validate recovery behaviour.

---

## Test Credentials

| Username | Password | Status |
|---|---|---|
| bod@example.com | 10203040 | Active user |
| alice@example.com | 10203040 | Locked out |

---

## Author

Manimaran Murugan
Senior QA Engineer
maran.jan31@gmail.com

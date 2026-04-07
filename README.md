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
git clone <repository-url>
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

### 6. Run the tests

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
| Device | Pixel 5 or Pixel 6 |
| Automation Engine | UIAutomator2 |
| Appium Server | localhost:4723 |

> **Note:** Running on API 33+ (Android 13 and above) may trigger an Android App Compatibility popup due to the app's target SDK. This is handled automatically by the framework's `dismissPopup` helper.

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
| User cannot proceed without required details | Edge case | Stays on address page with validation |

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
| Full checkout flow | Revenue-critical path — any regression here directly impacts business. Complex enough to justify automation investment. |
| Empty form submission | Regression-prone validation — developers frequently break this accidentally when modifying forms. |

#### Not Automated — with specific reasoning for this app

| Scenario | Why Not Automated |
|---|---|
| Network interruption during checkout | The demo app works fully offline and does not make real network calls — there is no network layer to interrupt. This test would pass regardless of network state and give false confidence. |
| Input format validation | Exploratory testing revealed the app has no input validation — the name field accepts numbers, the expiry field accepts any string. Automating against broken validation would produce meaningless results. These are documented as quality findings below. |
| Visual layout testing | Requires dedicated visual diffing tools such as Applitools. Out of scope for this framework but recommended as a next step. |
| Biometric authentication | Cannot be reliably simulated on an emulator. Requires real device testing with manual verification. |

---

## App Behaviour Findings

During framework development, exploratory testing revealed the following characteristics of the demo app. These directly influenced automation decisions and are documented here for full transparency.

### Finding 1 — Authentication accepts any credentials
**Observation:** The login screen accepts any username and password combination and logs the user in successfully. Only two exceptions exist — `alice@example.com` which is explicitly locked out, and the visual user account.

**Impact on automation:** The negative login test uses the locked out account rather than invalid credentials, since invalid credentials would incorrectly result in a successful login on this app.

**Note for production context:** In a real application this would be a critical security defect. Authentication must validate credentials against a backend. For ExpressVPN specifically, where user privacy is the core product promise, this type of vulnerability would be a severity 1 finding.

### Finding 2 — App operates fully offline
**Observation:** The app functions completely without a network connection. All product data, cart state, and checkout flows work offline with no backend dependency.

**Impact on automation:** Network interruption testing — one of the suggested edge cases in the assessment — was not implemented because there is no network layer to interrupt. A test simulating network loss would pass regardless of connection state and provide false coverage.

**Note for production context:** For a real mobile app, network interruption testing is critical — especially for a VPN client where connection stability is the core feature. The framework architecture supports adding network simulation tests when connected to a real backend.

### Finding 3 — Input fields have no format validation
**Observation:** The checkout address and payment forms accept any input in any field. The full name field accepts numbers. The card expiry field accepts any string format. The card number field accepts any length.

**Impact on automation:** Validation tests were scoped to verifying that empty required fields prevent form submission — the one validation that does exist. Testing specific format rules was not possible as no format rules are enforced.

**Note for production context:** In a real checkout flow, input validation is a key quality and security requirement. Card number format, expiry date validation, and postcode format checks would all be automated with specific test cases.

---

## Framework Architecture

### Page Object Pattern
Locators and page-specific actions are encapsulated in page classes under `pages/`. Tests never contain raw selectors — they call page methods instead. This means when a UI element changes, only one file needs updating.

### Shared Helpers
Common functions like `dismissPopup`, `navigateToLogin`, and `login` live in `helpers/appHelper.js`. This eliminates duplication across test files and makes the suite easier to maintain.

### Selector Strategy
We use `android=new UiSelector().resourceId()` selectors throughout. Resource IDs are stable, unique, and directly tied to the app's element identifiers — making tests resilient to UI changes like text or layout updates.

### Synchronisation
We use explicit waits (`waitForElement`) throughout — never hardcoded sleep timers. Each step waits for its target element to be present before interacting. This makes tests fast on good environments and resilient on slow ones.

---

## Multi-Platform Strategy

The framework is structured to support both Android and iOS:

```
config/
├── android.conf.js     ← Android capabilities
└── ios.conf.js         ← iOS capabilities (future)
```

To run on iOS, swap the helper configuration to point to XCUITest driver and update device capabilities. Test logic in `tests/` and `pages/` remains unchanged — only the config layer differs.

---

## CI/CD Integration

Tests are designed to run in CI pipelines. Example GitHub Actions configuration:

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

## Biggest Risks in Mobile Automation

| Risk | Impact | Mitigation |
|---|---|---|
| Device and OS fragmentation | Tests pass on one device, fail on another | Define a priority device matrix, use cloud device farm for broader coverage |
| Dynamic element IDs across builds | Selectors break after app updates | Use resource IDs over text-based selectors, review selectors on each release |
| Emulator vs real device behaviour | Network, sensors, biometrics behave differently | Always validate critical flows on real devices before release |
| Test environment instability | Flaky results unrelated to app quality | Use ephemeral test environments, isolate test data per run |
| App state pollution between tests | One test affects the next | Implement proper setup and teardown, use logout between scenarios |
| Android version compatibility | App behaviour differs across API levels | Test against minimum supported API and latest stable API |

---

## Test Reporting

HTML reports are generated automatically in `output/report.html` after each run.

```bash
# View report after running tests
start output/report.html    # Windows
open output/report.html     # Mac/Linux
```

---

## What I Would Add Next

Given more time, the next priorities would be:

1. **iOS platform configuration** — add XCUITest driver config and iOS-specific page objects
2. **Cloud device farm integration** — connect to BrowserStack or Sauce Labs for broader device coverage across API levels and manufacturers
3. **Real backend network testing** — when connected to a real API, add network interruption tests using tools like Charles Proxy or Appium's network simulation capabilities
4. **Input validation test suite** — once proper validation is implemented in the app, add format-specific test cases for all form fields
5. **Parallel execution** — run Android and iOS suites simultaneously to reduce pipeline time
6. **Quality metrics dashboard** — track flakiness rate, coverage of critical paths, and mean time to feedback over time
7. **Performance benchmarking** — measure app launch time and screen transition times as quality metrics

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
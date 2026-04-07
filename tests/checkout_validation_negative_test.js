const CommonPage = require('../pages/CommonPage');

Feature('Checkout Validation');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('User cannot proceed without entering required details', async ({ I }) => {
  await commonPage.navigateToLogin();
  await commonPage.login('bod@example.com', '10203040');
  await commonPage.addProductToCart();
  await commonPage.goToCartAndCheckout();

  await I.waitForElement('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameET")',20);
  await I.waitForElement('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/paymentBtn")',20);
  await I.tap('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/paymentBtn")');
  await I.waitForElement('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameErrorTV")',20);
  I.see('Please provide your full name.');
});



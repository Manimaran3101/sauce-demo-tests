const CommonPage = require('../pages/CommonPage');

Feature('Checkout Flow');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('User can complete checkout successfully', async ({ I }) => {
  await commonPage.navigateToLogin();
  await commonPage.login('bod@example.com', '10203040');
  await commonPage.addProductToCart();
  await commonPage.goToCartAndCheckout();
  await commonPage.enterAddress();
  await commonPage.enterPayment();
  await commonPage.placeOrder();
  await commonPage.verifySuccess();
});

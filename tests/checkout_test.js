const CommonPage = require('../pages/CommonPage');
const { users } = require('../data/testData');

Feature('Checkout Flow');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('User can complete checkout successfully', async () => {
  await commonPage.navigateToLogin();
  await commonPage.login(users.standard);
  await commonPage.addProductToCart();
  await commonPage.goToCartAndCheckout();
  await commonPage.enterAddress();
  await commonPage.enterPayment();
  await commonPage.placeOrder();
  await commonPage.verifySuccess();
});

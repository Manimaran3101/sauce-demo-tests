const CommonPage = require('../pages/CommonPage');
const { users } = require('../data/testData');

Feature('Checkout Validation');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('User cannot proceed without entering required details', async () => {
  await commonPage.navigateToLogin();
  await commonPage.login(users.standard);
  await commonPage.addProductToCart();
  await commonPage.goToCartAndCheckout();
  await commonPage.submitEmptyAddress();
  await commonPage.verifyFullNameError();
});

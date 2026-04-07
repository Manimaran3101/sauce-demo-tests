const CommonPage = require('../pages/CommonPage');

Feature('Login');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('Successful login with valid credentials', async ({ I }) => {
  await commonPage.navigateToLogin();
  await commonPage.login('bod@example.com', '10203040');
  await commonPage.verifySuccessfulLogin();
});

Scenario('Locked out user cannot login', async ({ I }) => {
  await commonPage.navigateToLogin();
  await commonPage.login('alice@example.com', '10203040');
  await commonPage.verifyLoginError();
});

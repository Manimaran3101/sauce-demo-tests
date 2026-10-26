const CommonPage = require('../pages/CommonPage');
const { users } = require('../data/testData');

Feature('Login');

let commonPage;

Before(({ I }) => {
  commonPage = new CommonPage(I);
});

Scenario('Successful login with valid credentials', async () => {
  await commonPage.navigateToLogin();
  await commonPage.login(users.standard);
  await commonPage.verifySuccessfulLogin();
});

Scenario('Locked out user cannot login', async () => {
  await commonPage.navigateToLogin();
  await commonPage.login(users.lockedOut);
  await commonPage.verifyLoginError();
});

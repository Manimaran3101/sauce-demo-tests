const { dismissPopup } = require('../helpers/appHelper');


class CommonPage {
  constructor(I) {
    this.I = I;

    this.selectors = {
      menuButton: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/menuIV")',
      loginMenuItem: 'android=new UiSelector().description("Login Menu Item")',
      username: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameET")',
      password: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/passwordET")',
      loginBtn: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginBtn")',
      productsTitle: 'android=new UiSelector().text("Products")',
      loginError: 'android=new UiSelector().textContains("locked out")',
      product: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)',
      addToCart: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartBt")',
      cartIcon: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cartRL")',
      fullName: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/fullNameET")',
      address: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/address1ET")',
      city: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cityET")',
      zip: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/zipET")',
      country: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/countryET")',
      paymentBtn: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/paymentBtn")',
      cardName: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameET")',
      cardNumber: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/cardNumberET")',
      expiry: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/expirationDateET")',
      cvv: 'android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/securityCodeET")',
      successMsg: 'android=new UiSelector().textContains("Thank you")'
    };
  }

  async scrollDown() {
    await this.I.touchPerform([
      { action: 'press', options: { x: 500, y: 1500 } },
      { action: 'moveTo', options: { x: 500, y: 500 } },
      { action: 'release' }
    ]);
    await this.I.wait(1);
  }

  async navigateToLogin() {
    const I = this.I;
    await dismissPopup(I);
    await I.waitForElement(this.selectors.menuButton, 20);
    await I.tap(this.selectors.menuButton);
    await I.waitForElement(this.selectors.loginMenuItem, 20);
    await I.tap(this.selectors.loginMenuItem);
    await I.waitForElement(this.selectors.username, 20);
  }

  async login(username, password) {
    const I = this.I;
    await I.fillField(this.selectors.username, username);
    await I.fillField(this.selectors.password, password);
    await I.tap(this.selectors.loginBtn);
  }

  async verifySuccessfulLogin() {
    const I = this.I;
    await I.waitForElement(this.selectors.productsTitle, 20);
    I.see('Products');
  }

  async verifyLoginError() {
    const I = this.I;
    await I.waitForElement(this.selectors.loginError, 20);
    I.see('locked out');
  }

  async addProductToCart() {
    const I = this.I;
    await I.waitForElement(this.selectors.product, 20);
    await I.tap(this.selectors.product);
    await this.scrollDown();
    await I.waitForElement(this.selectors.addToCart, 20);
    await I.tap(this.selectors.addToCart);
  }

  async goToCartAndCheckout() {
    const I = this.I;
    await I.waitForElement(this.selectors.cartIcon, 20);
    await I.tap(this.selectors.cartIcon);
    await I.waitForElement(this.selectors.addToCart, 20);
    await I.tap(this.selectors.addToCart);
  }

  async enterAddress() {
    const I = this.I;
    await I.waitForElement(this.selectors.fullName, 20);
    await I.fillField(this.selectors.fullName, 'Manimaran Murugan');
    await I.fillField(this.selectors.address, 'Loehstr');
    await I.fillField(this.selectors.city, 'Leverkusen  ');
    await I.fillField(this.selectors.zip, '51371');
    await I.fillField(this.selectors.country, 'Germany');
    await I.tap(this.selectors.paymentBtn);
  }

  async enterPayment() {
    const I = this.I;
    await I.waitForElement(this.selectors.cardNumber, 20);
    await I.fillField(this.selectors.cardName, 'Manimaran Murugan');
    await I.fillField(this.selectors.cardNumber, '1111111111111111');
    await I.fillField(this.selectors.expiry, '1234');
    await I.fillField(this.selectors.cvv, '123');
    await this.scrollDown();
    await I.waitForElement(this.selectors.paymentBtn, 20);
    await I.tap(this.selectors.paymentBtn);
  }

  async placeOrder() {
    const I = this.I;
    await this.scrollDown();
    await I.waitForElement(this.selectors.paymentBtn, 20);
    await I.tap(this.selectors.paymentBtn);
  }

  async verifySuccess() {
    const I = this.I;
    await I.waitForElement(this.selectors.successMsg, 20);
    I.see('Thank you');
  }
}

module.exports = CommonPage;

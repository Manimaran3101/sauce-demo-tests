const { dismissPopup, hideKeyboard } = require('../helpers/appHelper');
const { address, card } = require('../data/testData');

const byId = (id) => `android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/${id}")`;

// Scrolls the current screen until the element with this id is visible.
const scrollToId = (id) =>
  'android=new UiScrollable(new UiSelector().scrollable(true))' +
  `.scrollIntoView(new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/${id}"))`;

class CommonPage {
  constructor(I) {
    this.I = I;

    this.selectors = {
      menuButton: byId('menuIV'),
      loginMenuItem: 'android=new UiSelector().description("Login Menu Item")',
      username: byId('nameET'),
      password: byId('passwordET'),
      loginBtn: byId('loginBtn'),
      productsTitle: 'android=new UiSelector().text("Products")',
      loginError: 'android=new UiSelector().textContains("locked out")',
      product: `${byId('productIV')}.instance(0)`,
      cartButton: byId('cartBt'),
      cartIcon: byId('cartRL'),
      fullName: byId('fullNameET'),
      address: byId('address1ET'),
      city: byId('cityET'),
      zip: byId('zipET'),
      country: byId('countryET'),
      paymentBtn: byId('paymentBtn'),
      cardName: byId('nameET'),
      cardNumber: byId('cardNumberET'),
      expiry: byId('expirationDateET'),
      cvv: byId('securityCodeET'),
      fullNameError: byId('fullNameErrorTV'),
      successMsg: 'android=new UiSelector().textContains("Thank you")'
    };
  }

  // Buttons at the bottom of a screen can end up only partly visible after the scroll.
  // click() presses the visible part, tap() aims at the middle and can hit the nav bar.
  async tapAfterScroll(id) {
    const I = this.I;
    await hideKeyboard(I);
    await I.waitForElement(scrollToId(id), 20);
    await I.click(byId(id));
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

  async login({ username, password }) {
    const I = this.I;
    await I.fillField(this.selectors.username, username);
    await I.fillField(this.selectors.password, password);
    await hideKeyboard(I);
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
    await this.tapAfterScroll('cartBt');
  }

  async goToCartAndCheckout() {
    const I = this.I;
    await I.waitForElement(this.selectors.cartIcon, 20);
    await I.tap(this.selectors.cartIcon);
    // on the cart screen the same button id is "Proceed To Checkout"
    await I.waitForElement(this.selectors.cartButton, 20);
    await I.tap(this.selectors.cartButton);
    await I.waitForElement(this.selectors.fullName, 20);
  }

  async enterAddress() {
    const I = this.I;
    await I.fillField(this.selectors.fullName, address.fullName);
    await I.fillField(this.selectors.address, address.street);
    await I.fillField(this.selectors.city, address.city);
    await I.fillField(this.selectors.zip, address.zip);
    await I.fillField(this.selectors.country, address.country);
    await this.tapAfterScroll('paymentBtn');
  }

  async submitEmptyAddress() {
    await this.tapAfterScroll('paymentBtn');
  }

  async verifyFullNameError() {
    const I = this.I;
    await I.waitForElement(this.selectors.fullNameError, 20);
    I.see('Please provide your full name.');
  }

  async enterPayment() {
    const I = this.I;
    await I.waitForElement(this.selectors.cardNumber, 20);
    await I.fillField(this.selectors.cardName, card.name);
    await I.fillField(this.selectors.cardNumber, card.number);
    await I.fillField(this.selectors.expiry, card.expiry);
    await I.fillField(this.selectors.cvv, card.cvv);
    await this.tapAfterScroll('paymentBtn');
  }

  async placeOrder() {
    await this.tapAfterScroll('paymentBtn');
  }

  async verifySuccess() {
    const I = this.I;
    await I.waitForElement(this.selectors.successMsg, 20);
    I.see('Thank you');
  }
}

module.exports = CommonPage;

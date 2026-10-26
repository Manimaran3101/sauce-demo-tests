const selectors = {
  compatibilityPopup: 'android=new UiSelector().resourceId("android:id/button1")'
};

// Newer Android versions show a "built for an older version" popup on first launch.
async function dismissPopup(I) {
  try {
    const count = await I.grabNumberOfVisibleElements(selectors.compatibilityPopup);
    if (count > 0) {
      await I.tap(selectors.compatibilityPopup);
      await I.waitForInvisible(selectors.compatibilityPopup, 5);
    }
  } catch (e) {
    // popup not there, carry on
  }
}

// After fillField the keyboard stays open and can cover buttons at the bottom.
async function hideKeyboard(I) {
  try {
    await I.hideDeviceKeyboard();
  } catch (e) {
    // keyboard was already closed
  }
}

module.exports = { dismissPopup, hideKeyboard, selectors };

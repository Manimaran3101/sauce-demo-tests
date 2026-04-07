const selectors = {
  compatibilityPopup: 'android=new UiSelector().resourceId("android:id/button1")'
};

async function dismissPopup(I) {
  try {
    const count = await I.grabNumberOfVisibleElements(selectors.compatibilityPopup);
    if (count > 0) {
      await I.tap(selectors.compatibilityPopup);
      await I.wait(1);
    }
  } catch (e) {
    // popup not present — continue
  }
}

module.exports = { dismissPopup, selectors };
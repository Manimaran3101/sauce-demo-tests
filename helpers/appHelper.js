const selectors = {
  compatibilityPopup: 'android=new UiSelector().resourceId("android:id/button1")'
};
 
async function dismissPopup(I) {
  try {
    await I.waitForElement(selectors.compatibilityPopup, 3);
    await I.tap(selectors.compatibilityPopup);
    await I.wait(1);
  } catch (e) {

  }
}
 
module.exports = { dismissPopup, selectors };
 
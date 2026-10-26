// Demo accounts come from the app's own login screen.
// Address and card details are made up. The app does not check formats.
module.exports = {
  users: {
    standard: { username: 'bod@example.com', password: '10203040' },
    lockedOut: { username: 'alice@example.com', password: '10203040' }
  },

  address: {
    fullName: 'Test User',
    street: '1 Test Street',
    city: 'Berlin',
    zip: '10115',
    country: 'Germany'
  },

  card: {
    name: 'Test User',
    number: '4111111111111111',
    expiry: '1230',
    cvv: '123'
  }
};

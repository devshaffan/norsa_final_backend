const _ = require('lodash');
module.exports = function reduceUserData(userDetails) {
  return {
    ..._.pick(userDetails, [
      'id',
      'accessToken',
      'refreshToken',
      'dormantUser',
      'isAdmin',
      'expiryDate',
      'pinCode',
      'Merchant_ID'
    ])
  };
};
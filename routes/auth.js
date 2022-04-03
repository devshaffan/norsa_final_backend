const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const reduceUserData = require('../utils/reduceUserData');
const validator = require('../utils/validator');
const passport = require('passport');
const models = require('../models');
const loggedInUsers = [];
router.post( '/signup', ( req, res, next ) => {
  const { email, password, isAdmin } = req.body;
  const emailValidation = validator.isValidEmail( email );
  if ( !emailValidation.valid ) {
    return res.status( 400 ).send( {
      result: 'error',
      message: emailValidation.reason
    } );
  }
  const passwordValidation = validator.isValidPassword( password );
  if ( !passwordValidation.valid ) {
    return res.status(400).send({
      result: 'error',
      message: passwordValidation.reason
    });
  }
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(400).json({ result: 'error', message: info.message }); }
    return res.json({ result: 'ok', data: `Confirmation link has been sent to ${email}` });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  const emailValidation = validator.isValidEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).send({
      result: 'error',
      message: emailValidation.reason
    });
  }
  const passwordValidation = validator.isValidPassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).send({
      result: 'error',
      message: passwordValidation.reason
    });
  }
  passport.authenticate('local-signin', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(400).json({ result: 'error', message: info.message });
    }
    return req.logIn(user, async (errLogin) => {
      if (err) { return next(errLogin); }
      //will use set here to make sure unique 
      // loggedInUsers.push(user.id:{
      //   expires: Date.now() + (60*1500*1000)
      // }
      //     ,
      //     userId: );
      const {pinCode} = await models.merchants.findOne({
        attributes : ['pinCode'],
        where : {
          User_id : user.id
        }
      })
      user.pinCode = pinCode
      return res.status(200).json({ result: 'ok', data: reduceUserData(user), });
    });
  })(req, res, next);
});
router.get('/logout', (req, res) => {
   loggedInUsers.splice(loggedInUsers.indexOf(req.user.id), 1);
});
router.get('/loggedInUsers', (req, res) => {
  //console.log(loggedInUsers.length);
  loggedInUsers.forEach(user => {
    if(user.expires < Date.now()) {
      loggedInUsers.splice(loggedInUsers.indexOf(req.user.id), 1);
  }
  });
  //console.log(loggedInUsers.length);
  return res.status(200).json({ result: 'ok', data: loggedInUsers.length });
});

// apis
// router.get(
//   '/confirm-email/deeplink',
//   deeplink({
//     fallback: 'https://snowball.money',
//     android_package_name: 'com.snowball.money',
//     ios_store_link:
//       'https://snowball.money'
//   })
// );

router.post('/verification-email', auth.verificationEmail);
router.get('/confirm-email', auth.confirmEmail);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.post('/change-password', auth.changePassword);
router.post('/validate-reset-password', auth.validateResetPassword);
router.post('/refresh-session', auth.refreshSession);
router.get('/ifValid',auth.ifValid);
router.get('/getMerchantIdForLoggedInUser/:id',auth.getMerchantIdForLoggedInUser);
module.exports = router;

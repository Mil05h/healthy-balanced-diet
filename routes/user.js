const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const passport = require('passport');
const catchAsyncErr = require('../utils/catchAsyncErr');
const { isSended, validateResetPassword, validateChangePassword, isLoggedIn, isProfileOwner, isVerified, validateRegister, validateUpdateNewUser } = require('../middleware')


router.route('/login')
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/' }), isVerified, catchAsyncErr(user.loginUser))

router.route('/register')
    .post(validateRegister, catchAsyncErr(user.createNewUser))

router.route('/logout')
    .get(user.logoutUser)

router.route('/forgotPassword')
    .get(user.renderForgotPassword)
    .post(isSended, catchAsyncErr(user.emailSent))

router.route('/forgotPassword/:userId/:secret')
    .get(catchAsyncErr(user.renderResetPassword))
    .patch(validateResetPassword, catchAsyncErr(user.resetPassword))

router.route('/changePassword/:userId/')
    .patch(isLoggedIn, isProfileOwner, validateChangePassword, catchAsyncErr(user.changePassword))

router.route('/plan/:userId')
    .get(isLoggedIn, isProfileOwner, isVerified, catchAsyncErr(user.renderUserPage))
    .put(isLoggedIn, isProfileOwner, validateUpdateNewUser, catchAsyncErr(user.updateNewUser))
    .delete(isLoggedIn, isProfileOwner, catchAsyncErr(user.deleteUser))

router.route('/verify/:userId')
    .get(isSended, catchAsyncErr(user.verifyEmail))

router.route('/verify/me/:secret')
    .get(catchAsyncErr(user.verified))


module.exports = router;


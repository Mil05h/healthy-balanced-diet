const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware')

router.route('/')
    .get(passport.authenticate('google', { scope: ['email', 'profile'] }))

router.route('/callback')
    .get(passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
        failureFlash: true
    }))



router.route('/success')
    .get(isLoggedIn, (req, res) => {
        const user = req.user;
        if (!user.googleId) {
            req.logout()
            req.flash('error', 'Your Google Account is not linked, please Log In using your your password')
            res.redirect('/')
        } else {
            if (user.height === 1) {
                res.render('user/updateNewUserForm', { user })
            } else {
                res.redirect(`/plan/${user._id}`)
            }
        }
    })

router.route('/failure')
    .get((req, res) => {
        req.flash('error', 'Google registration failed')
        res.redirect('/')
    })

module.exports = router;


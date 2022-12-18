const express = require('express');
const router = express.Router({ mergeParams: true });
const admin = require('../controllers/admin')
const passport = require('passport');
const catchAsyncErr = require('../utils/catchAsyncErr');
const { isAdmin } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('')
    .get(isAdmin, catchAsyncErr(admin.renderAdmin))

router.route('/login')
    .get(catchAsyncErr(admin.renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin9196/login' }), isAdmin, catchAsyncErr(admin.loginAdmin))

router.route('/:userId')
    .get(isAdmin, catchAsyncErr(admin.renderUser))

router.route('/:userId/:dietId')
    .get(isAdmin, catchAsyncErr(admin.renderDietDetails))
    .post(isAdmin, upload.single('dietPlanPdf'), catchAsyncErr(admin.sendDiet))

router.route('/:userId/:dietId/pdf')
    .delete(isAdmin, catchAsyncErr(admin.deleteDietPdf))

router.route('/:userId/:dietId/order')
    .delete(isAdmin, catchAsyncErr(admin.deleteDietOrder))

router.route('/blogPost')
    .post(isAdmin, catchAsyncErr(admin.createBlogPost))

router.route('/blogPost/:postId')
    .put(isAdmin, catchAsyncErr(admin.editBlogPost))
    .delete(isAdmin, catchAsyncErr(admin.deleteBlogPost))


module.exports = router;


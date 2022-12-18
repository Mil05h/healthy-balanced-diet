const express = require('express');
const router = express.Router({ mergeParams: true });
const measure = require('../controllers/measure')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const catchAsyncErr = require('../utils/catchAsyncErr');
const { isLoggedIn, isProfileOwner, validateMeasures, isMeasureAuthor } = require('../middleware')


router.route('/')
    .post(isLoggedIn, isProfileOwner, upload.array('image', 3), validateMeasures, catchAsyncErr(measure.createNewMeasure))

router.route('/new')
    .get(isLoggedIn, isProfileOwner, catchAsyncErr(measure.renderNewMeasure))

router.route('/remove/:removeFA')
    .delete(isLoggedIn, isProfileOwner, catchAsyncErr(measure.deleteFoodAllergy))

router.route('/:measureId')
    .put(isLoggedIn, isProfileOwner, upload.array('image', 3), validateMeasures, isMeasureAuthor, catchAsyncErr(measure.editMeasure))
    .delete(isLoggedIn, isProfileOwner, isMeasureAuthor, catchAsyncErr(measure.deleteMeasure))

router.route('/:measureId/edit')
    .get(isLoggedIn, isProfileOwner, catchAsyncErr(measure.renderEditMeasure))

router.route('/allMeasurements')
    .get(isLoggedIn, isProfileOwner, catchAsyncErr(measure.renderAllMeasurements))

module.exports = router;


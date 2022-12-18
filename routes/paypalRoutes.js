const express = require('express');
const router = express.Router();
const catchAsyncErr = require('../utils/catchAsyncErr');
const { isLoggedIn, isProfileOwner, } = require('../middleware')
const paypal = require("../paypal-api");
const User = require('../models/user');
const Diet = require('../models/diet')
const nodemailer = require("nodemailer");

router.route('/:userId')
    .post(isLoggedIn, isProfileOwner, catchAsyncErr(async (req, res) => {
        const order = await paypal.createOrder();
        res.json(order);
    }))

router.route('/:orderID/capture/:userId')
    .post(isLoggedIn, isProfileOwner, catchAsyncErr(async (req, res) => {
        const { orderID, userId } = req.params;
        const captureData = await paypal.capturePayment(orderID);
        const user = await User.findById(userId);
        const diet = new Diet({
            url: 'ordered',
            filename: 'ordered',
            user: user._id,
            orderDate: new Date(),
            transactionId: captureData.id,
            transactionStatus: captureData.status,
            transactionValue: captureData.purchase_units[0].payments.captures[0].amount.value,
            orderDetails: req.query.details,
            excerciseLevel: req.query.excerciseLevel
        });
        await diet.save()
        user.foodAllergies = req.query.foodAllergies;
        user.diets.push(diet._id);
        await user.save()
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDINBLUE_USER,
                pass: process.env.SENDINBLUE_PASS,
            },
        })
        await transporter.sendMail({
            from: '"Healthy Balanced Diet" <noreply@healthybalanceddiet.com>',
            to: 'lekolekovic@gmail.com',
            subject: "You have new order",
            text: `User: ${user.username}, _id: ${user._id} ordered new diet.`,
            html: `<h1>User: ${user.username}, _id: ${user._id} ordered new diet.</h1>`
        });
        res.json(captureData);
        // console.log("Capture result",
        //     req.query
        //     captureData,
        //     userId,
        //     JSON.stringify(captureData, null, 2)
        //     user
        // )
    }))

router.route('/paypalError/:userId')
    .get(isLoggedIn, isProfileOwner, catchAsyncErr(async (req, res) => {
        const { userId } = req.params;
        res.render('paypalError', { userId })
    }))

router.route('/paypalSuccess/:userId')
    .get(isLoggedIn, isProfileOwner, catchAsyncErr(async (req, res) => {
        req.flash('success', 'Successfull ordered. You can expect diet plan within one week.')
        res.redirect(`/plan/${req.params.userId}`)
    }))


module.exports = router;
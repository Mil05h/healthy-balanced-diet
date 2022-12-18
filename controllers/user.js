const User = require('../models/user');
const SHA256 = require("crypto-js/sha256");
const { cloudinary } = require('../cloudinary');
const nodemailer = require("nodemailer");


module.exports.loginUser = async (req, res) => {
    const user = await User.findById(req.user._id);
    req.flash('success', 'Welcome to your progress monitoring page')
    res.redirect(`/plan/${user._id}`);
}

module.exports.createNewUser = async (req, res) => {
    const { username, password, gender, email, height, dob, unit } = req.body;
    const user = new User({ email, username, gender, height, dob, unit });
    const registredUser = await User.register(user, password);
    req.logout()
    res.redirect(`/verify/${user._id}`)
}


module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect('/')
}

module.exports.renderUserPage = async (req, res) => {
    const user = await User.findById(req.params.userId).populate(
        {
            path: 'measures',
            options: {
                sort: {
                    'createdAt': -1
                }
            }
        })
        .populate(
            {
                path: 'diets',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            });
    res.render('user/profile', { user })
}

module.exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId).populate('measures')
    for (let i = 0; i < user.measures.length; i++) {
        for (f of user.measures) {
            for (img of f.images) {
                const filename = img.filename
                await cloudinary.uploader.destroy(filename)
            }
        }
    }
    req.logout()
    req.flash('success', 'Successfully deleted profile')
    res.redirect('/')
}

module.exports.verifyEmail = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const rand = Math.floor(Math.random() * 1000);
    const scrt = SHA256(`secret${rand}`).toString();
    ///////////////// REPLACE 'link' BEFORE DEPLOYING /////////////////////

    const link = `http://healthy-balanced-diet.cyclic.app/verify/me/${scrt}`
    // const link = `http://${req.hostnam}/verify/me/${secret}`

    ///////////////// REPLACE 'link' BEFORE DEPLOYING /////////////////////
    user.secret = scrt;
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
    try {
        await transporter.sendMail({
            from: '"Healthy Balanced Diet Me" <noreply@hd4m.com>',
            to: user.email,
            subject: "Please confirm your Email account",
            text: 'Hello, Please Click on the link to verify your email.',
            html: `Hello,<br> Please Click on the link to verify your email.<br><a href='${link}'>Click here to verify</a>`
        })
        req.flash('success', 'Please check Your email for verification')
        res.redirect('/')
    } catch (e) {
        console.log(e)
        req.flash('error', 'Something went wrong, please try again later')
        res.redirect('/')
    }
}


module.exports.verified = async (req, res) => {
    const user = await User.findOne({ secret: req.params.secret })
    if (user) {
        user.isVerified = true;
        user.secret = "";
        await user.save();
        req.flash('success', 'Thank you for verifying your email, you can now login')
        res.redirect('/')
    } else {
        req.flash('error', 'You are allready verified, or your profile doesnt exist')
        res.redirect('/')
    }
}

module.exports.renderChangePasswordForm = async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId);
    if (user.googleId) {
        req.flash('error', 'You cannot do that')
        res.redirect(`/plan/${user._id}`)
    }
    res.render('user/changePasswordForm', { user })
}


module.exports.renderForgotPassword = (req, res) => {
    res.render('user/forgotPassword')
}

module.exports.emailSent = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
        if (user.googleId) {
            req.flash('error', 'Conntinue to your page using Google')
            return res.redirect('/')
        }
        else if (user.secret) {
            req.flash('error', 'Password reset link for this account has been sent, Please check your e-mail')
            return res.redirect('/')
        } else {
            const rand = Math.floor(Math.random() * 1000);
            const secret = SHA256(`secret${rand}`).toString()

            ///////////////// REPLACE 'link' BEFORE DEPLOYING /////////////////////

            const link = `http://healthy-balanced-diet.cyclic.app/forgotPassword/${user._id}/${secret}`
            // const link = `http://${req.hostnam}/forgotPassword/${user._id}/${secret}`

            ///////////////// REPLACE 'link' BEFORE DEPLOYING /////////////////////
            const transporter = nodemailer.createTransport({
                host: "smtp-relay.sendinblue.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SENDINBLUE_USER,
                    pass: process.env.SENDINBLUE_PASS,
                },
            })
            try {
                await transporter.sendMail({
                    from: '"Healthy Balanced Diet" <noreply@hd4m.com>',
                    to: user.email,
                    subject: "Change your Password",
                    text: `Hello ${user.username}, Please Click on the link to change your password.`,
                    html: `Hello ${user.username},<br> Please Click on the link to change your password.<br><a href='${link}'>Click here to change password</a>`
                });
                user.secret = secret;
                await user.save()
                req.flash('success', 'E-mail sent')
                return res.redirect('/')
            } catch (e) {
                console.log(e)
                req.flash('error', 'Something went wrong')
                return res.redirect('/')
            }
        }
    }
    req.flash('error', 'User with that email does not existe')
    res.redirect('/')
}

module.exports.renderResetPassword = async (req, res) => {
    const { userId, secret } = req.params;
    const user = await User.findById(userId);
    if (user.secret !== secret) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/')
    } else {
        return res.render('user/resetPassword', { user })
    }

}

module.exports.resetPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const user = await User.findById(userId);
    await user.setPassword(newPassword)
        .then(() => {
            return req.flash('success', 'Successfuly changed password')
        })
        .catch((error) => {
            return req.flash('error', 'Error while changing password');
        })
    user.secret = "";
    await user.save()
    res.redirect('/');
}

module.exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword, oldPassword } = req.body;
    const user = await User.findById(userId);
    await user.changePassword(oldPassword, newPassword)
        .then(() => {
            return req.flash('success', 'Successfuly changed password')
        })
        .catch((error) => {
            return req.flash('error', 'Error while changing password');
        })
    await user.save()
    res.redirect(`/plan/${userId}`);
}


module.exports.updateNewUser = async (req, res) => {
    const { userId } = req.params
    const user = await User.findByIdAndUpdate(userId, req.body)
    user.isVerified = true;
    await user.save()
    res.redirect(`/plan/${user._id}`)
}
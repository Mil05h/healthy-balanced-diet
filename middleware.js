const { resetPasswordSchema, registerSchema, measuresSchema, changePasswordSchema, updateNewUserSchema } = require('./schemas.js');
const ExpressError = require('./utils/expressError');
const User = require('./models/user');
const Measure = require('./models/measure')
const catchAsyncErr = require('./utils/catchAsyncErr')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        const msg = 'Must Login first';
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.isProfileOwner = catchAsyncErr(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user._id.equals(req.user._id)) {
        const msg = 'Do not have permision';
        throw new ExpressError(msg, 400)
    }
    next()
})

module.exports.isMeasureAuthor = catchAsyncErr(async (req, res, next) => {
    const { userId, measureId } = req.params;
    const measure = await Measure.findById(measureId);
    if (!measure.user.equals(req.user._id)) {
        const msg = 'Do not have permision';
        throw new ExpressError(msg, 400)
    }
    next()
})

module.exports.isSended = catchAsyncErr(async (req, res, next) => {
    const { userId, } = req.params;
    const user = await User.findById(userId);
    if (user.secret.length) {
        const msg = 'Mail already sent';
        throw new ExpressError(msg, 400)
    }
    next()
})


module.exports.validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.validateMeasures = (req, res, next) => {
    const { error } = measuresSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAdmin = catchAsyncErr(async (req, res, next) => {
    const admin = await User.findById(req.user._id);
    if (!admin.isAdmin) {
        const msg = 'Not an admin';
        throw new ExpressError(msg, 400)
    }
    next()
})

module.exports.isVerified = catchAsyncErr(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user.isVerified) {
        if (!user.googleId) {
            req.logout()
            const msg = 'Please check your email';
            throw new ExpressError(msg, 400)
        } else {
            const msg = 'Please provide necesery data';
            throw new ExpressError(msg, 400)
        }
    }
    next()
})


module.exports.validateUpdateNewUser = (req, res, next) => {
    const { error } = updateNewUserSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateResetPassword = (req, res, next) => {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateChangePassword = (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
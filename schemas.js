const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});


const Joi = BaseJoi.extend(extension)



module.exports.registerSchema = Joi.object({
    unit: Joi.string().required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    username: Joi.string().min(6).max(20).alphanum().required().escapeHTML(),
    password: Joi.string().min(6).max(20).escapeHTML(),
    repeatPassword: Joi.ref('password'),
    dob: Joi.date().required(),
    gender: Joi.string().required().escapeHTML(),
    height: Joi.number().required().min(2)
});



module.exports.resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).max(20).escapeHTML(),
    repeatPassword: Joi.ref('newPassword'),
});

module.exports.changePasswordSchema = Joi.object({
    oldPassword: Joi.string().escapeHTML(),
    newPassword: Joi.string().min(6).max(20).escapeHTML(),
    repeatPassword: Joi.ref('newPassword'),
});


module.exports.measuresSchema = Joi.object({
    measure: Joi.object({
        dietStatus: Joi.string().required().escapeHTML(),
        weight: Joi.number().required().min(0),
        neck: Joi.number().required().min(0),
        waist: Joi.number().required().min(0),
        hip: Joi.number().required().min(0)
    }).required(),
    deleteImages: Joi.array()
})



module.exports.userStatusSchema = Joi.object({
    dietStatus: Joi.string().required().escapeHTML()
})

module.exports.updateNewUserSchema = Joi.object({
    unit: Joi.string().required().escapeHTML(),
    dob: Joi.date().required(),
    gender: Joi.string().required().escapeHTML(),
    height: Joi.number().required().min(2)
})
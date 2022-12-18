const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const Measure = require('./measure');


const UserSchema = new Schema({
    unit: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric',
        required: true
    },
    secret: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        required: true,
    },
    measures: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Measure'
        }
    ],
    foodAllergies: String,
    diets:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Diet'
        }
    ],
    googleId: String,
    fatPerc: Number
},
    { timestamps: true }
);

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Measure.deleteMany({
            _id: {
                $in: doc.measures
            }
        })
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)




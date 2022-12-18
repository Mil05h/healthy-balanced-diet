const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DietSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderDate: {
        type: Date,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    transactionStatus: {
        type: String,
        required: true,
    },
    transactionValue: {
        type: Number,
        required: true,
    },
    orderDetails: {
        type: String,
        required: true,
    },
    excerciseLevel: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        required: true,
    }
},
    { timestamps: true }
);


module.exports = mongoose.model('Diet', DietSchema)
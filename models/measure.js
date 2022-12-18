const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});


const MeasureSchema = new Schema({
    weight: {
        type: Number,
        required: true
    },
    neck: {
        type: Number,
        required: true
    },
    waist: {
        type: Number,
        required: true
    },
    hip: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dietStatus: {
        type: String,
        required: true,
        enum: ["Using", 'Partialy using', 'Not using'],
        default: 'Not using'
    },
    images: [ImageSchema]
},
    { timestamps: true }
);


module.exports = mongoose.model('Measure', MeasureSchema)
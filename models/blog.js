const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BlogSchema = new Schema({
    title: String,
    body: String,
    category: String,
    imgUrl: String
},
    { timestamps: true }
);


module.exports = mongoose.model('Blog', BlogSchema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category:  String
});

module.exports = mongoose.model('Category', CategorySchema)
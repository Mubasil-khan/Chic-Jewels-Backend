
const mongoose = require('mongoose');


const User = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    CartItems: { type: Object, default: {} }

}, { minimize: false })


module.exports = mongoose.model('user', User)
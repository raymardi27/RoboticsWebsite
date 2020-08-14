var mongoose = require('mongoose');

var feedback = new mongoose.Schema({
    name: String,
    email: String,
    messagee: String,
})

var feedback = mongoose.model('feedback', feedback)

module.exports = feedback;
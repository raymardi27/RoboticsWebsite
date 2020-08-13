var mongoose = require('mongoose');

var users = new mongoose.Schema({
    name: String,
    email: String,
    college: String,
    ticket: Number,
    eventID: Number,
    reason: String
})

var users = mongoose.model('users', users)

module.exports = users;
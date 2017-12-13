var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    surname: String,
    role: String,
    pin_hashed: String,
    rfid_tag: String,
});

module.exports = mongoose.model('User', UserSchema);

var mongoose = require('mongoose');
var crypto = require('crypto');

/*
User
    > User can create MainComments
    > User can SubComment on other User's MainComments
*/

var userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    displayname: {
        type: String,
        required: true,
        unique: false
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: Object,
        required: true
    },
    datecreated: { 
        type: Date, 
        default: Date.now 
    },
    previouslogin: { 
        type: Date,
        default: Date.now 
    },
    lastlogin: { 
        type: Date,
        default: Date.now 
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.checkPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.name = function() {
    return this.displayname || this.email;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

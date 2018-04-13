var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: String,
    mobile: String,
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    experience: String,
    company: String,
    position: String,
    school: String,
    concentration: String,
    secondaryc: String,
    degree: String,
    graduation: String


});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);

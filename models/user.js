const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: "Username is required",
        trim: true,
        unique: true,
        max:32
    },
    email:{
        type: String,
        required: "Email is required",
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: "Password is required"
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    image: String,
    about: String
})

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); 
userSchema.plugin(mongooseBcrypt);

module.exports = mongoose.model('User', userSchema);
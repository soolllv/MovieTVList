const User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
const Passport = require('passport');
const Friends =  require('../models/friendsData');
const { findOneAndUpdate } = require('../models/user');
const DPU = require('../models/dataPerUser');
const cloudinary = require('cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.diskStorage({});

const upload = multer({storage});

exports.upload = upload.single('image');

exports.pushToCloudinary = (req, res, next) => {
    if(req.file){
        cloudinary.v2.uploader.upload(req.file.path)
        .then((result) =>{
            req.body.image = result.public_id;
            next();
        })
        .catch(() =>{
            res.redirect('/settings');
        })
    } else {
        next();
    }
}


//-----------------

exports.signUpGet = (req, res) =>{
    res.render('sign-up', {title: "Sign Up"})
}
exports.signUpPost = [
    body('username').isLength({min: 1}).withMessage('Username must be specified')
    .isAlphanumeric().withMessage("Username must be alphanumeric"),

    body('email').isEmail().withMessage('Invalid Email'),
    
    body('password').isLength({min: 8}).withMessage('Invalid Password, password must be minimum of 8 characters'),

    body('confirm_password').custom((value, {req}) => value === req.body.password)
    .withMessage("Passwords do not match"),

    async(req, res, next) =>{
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('sign-up', {title: 'Please fix following errors:', errors: errors.array()})
        }else{
            const newUser = new User(req.body);
            User.register(newUser, req.body.password, (err) =>{
                if(err){
                    console.log('error while registering!', err);
                    return next(err);
                }
            })
            const friends = new Friends();
            friends.username = req.body.username;
            await friends.save();
        }
    }
]
exports.loginGet = (req, res) =>{
    res.render('login', {title: "Login"});
}
exports.loginPost = Passport.authenticate('local', {
    successFlash: 'You are now logged in',
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: 'Login failed, try again!'
});
exports.logout = (req, res) =>{
    req.logout();
    res.redirect('/');
}

exports.settingsGet = (req, res) =>{
    const userData = req.user;
    res.render('settings', {title: "Settings", userData})
}
exports.settingsAccountPost = async(req, res, next) =>{
    try{
        if(req.body.username){
            await User.findOneAndUpdate({ username: req.user.username}, {username: req.body.username}, {new: true});
            await Friends.updateMany({ username: req.user.username}, {username: req.body.username});
            await DPU.updateMany({ username: req.user.username}, {username: req.body.username});
        }
        if(req.body.email){
            await User.findOneAndUpdate({ username: req.user.username}, { email: req.body.email}, {new: true});
        }
        if(req.body.password){
            // no idea            
        }
        res.redirect('/settings/account')
    }
    catch{
        next(error);
    }
}

exports.settingsProfilePost = async(req,res,next) => {
    try{
        console.log(req.body.image);
        if(req.body.image){
            await User.findByIdAndUpdate(req.user._id, {image: req.body.image}, {new: true});
        }
        if(req.body.about){
            await User.findByIdAndUpdate(req.user._id, {about: req.body.about}, {new: true});
        }
        res.redirect('/settings')
    } catch{
        next(error);
    }
}
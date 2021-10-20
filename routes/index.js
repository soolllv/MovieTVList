var express = require('express');
var router = express.Router();

const someController = require('../controllers/controller')
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', someController.firstPage);
router.get('/home', someController.homePage);
router.get('/user/:userName', someController.profilePage);
router.post('/user/:userName', someController.addFriend);
router.get('/movie/:imdbID', 
    someController.apiSearch,
    someController.mvtvPage);
router.post('/movie/:imdbID', 
    someController.apiSearch,
    someController.dataToDPU);
router.get('/search/movie', someController.searchMovieGet);
router.get('/user/:userName/social', someController.socialPage);
router.get('/user/:userName/:list', someController.movieListPage);


// USER CONTROLLER
router.get('/sign-up', userController.signUpGet);
router.post('/sign-up', 
    userController.signUpPost,
    userController.loginPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout)
router.get('/settings', userController.settingsGet);
router.get('/settings/account', userController.settingsGet);
router.post('/settings', 
    userController.upload,
    userController.pushToCloudinary,
    userController.settingsProfilePost);
router.post('/settings/account', userController.settingsAccountPost);


module.exports = router;

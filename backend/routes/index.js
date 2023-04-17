var express = require('express');
var router = express.Router();
var userController = require('../controllers/index');
var multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'F:/Programing/React website/Project codeUNIT/frontend/src/uploads/')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// route for signup page
router.post('/signup', userController.SignUpController);

// route for sign in page
router.post('/signin', userController.SignInController);

// route for forgot password page
router.post('/forgotpassword', userController.ForgotPasswordController);

// route for user profile data
router.get('/user-profile', userController.userProfileController)

// rooute for user profile update
router.post('/user-profile-update', userController.userProfileUpdateController)

// route for user profile photo
router.post('/user-profile-photo', upload.single("avatar"),  userController.userProfilePhotoController)

// route for getuser details by email
router.post('/getUserDetailsByEmail', userController.getUserDetailsbyEmailController)

module.exports = router;

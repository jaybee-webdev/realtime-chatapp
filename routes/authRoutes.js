// const { authJwt } = require("../middleware");
// const uploadFile = require("../middleware/upload");
const { auth, authGoogle } = require('../middlewares/auth')
// const uploadFile = require("../middleware/upload");
const uploadFile = require("../middlewares/upload");
const { RegisterUser, UploadDp, LoginUser, UpdateUser, LogoutUser, getUserDetails, LoginGoogle, getAllUser } = require('../controllers/authController');
// app.post(‘/api/users/register,RegisterUser);
// app.post(‘/api/users/login’,LoginUser);
// app.get(‘/api/users/auth’,auth,getUserDetails);
// app.get(‘/api/users/logout’, auth, LogoutUser);


module.exports = app => {
  
    var router = require("express").Router();

//Post
router.post('/users/register', RegisterUser);
router.post('/users/login', LoginUser);
router.post('/user/update', auth, UpdateUser);
router.post('/users/loginGoogle', authGoogle, LoginGoogle);


router.post('/upload/dp', 
[auth, uploadFile.single("file")],
UploadDp);

//GET Routes
router.get('/users/auth', auth, getUserDetails);
router.get('/get/AllUsers', auth, getAllUser);

// router.get('/users/logout', auth, LogoutUser);
    app.use('/api', router);
  };
  
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT = 10;
const { testToken, jwtSecret } = require('../configs/static');


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true,'The fullName field is required!'],
        trim: true,
        maxlength: 100
       },
    email: {
        type: String,
        required: [true,'The email field is required!'],
        trim: true,
        unique: 1
        },
    password: {
        type: String,
        minlength: 5
        },
    dpUrl: {
           type: String,
       },
    token: {
        type: String,
        },
        callerId: {
            stype: String
        }
})

//saving user data
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {//checking if password field is available and modified
    bcrypt.genSalt(SALT, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
    if (err) return next(err)
    user.password = hash;
    next();
   });
   });
   } else {
    next();
    }
   });

   //for comparing the users entered password with database duing login 
userSchema.methods.comparePassword = function (candidatePassword, callBack) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
   });
   }

//for generating token when loggedin
userSchema.methods.generateToken = function (callBack) {
    var user = this;
    let token = jwt.sign(String(user._id), jwtSecret)
    user.token = token;
    user.save(function (err, user) {
    if (err) return callBack(err)
    callBack(null, user)
   });
   };


//validating token for auth routes middleware
userSchema.statics.findByToken = function (token, callBack) {
    var user = this;
    jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {//this decode must give user_id if token is valid .ie decode=user_id
        console.log('ptoata')
    user.findOne({ '_id': decode, 'token': token }, function (err, user) {
    if (err) return callBack(err);
    callBack(null, user);
    });
   });
   };
   
   const User = mongoose.model('users', userSchema);

   module.exports = { User }


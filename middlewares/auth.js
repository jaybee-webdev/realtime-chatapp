//in auth.js
const { isValidObjectId } = require('mongoose');
const { User } = require('../models/userModel');
const { testToken, jwtSecret } = require('../configs/static');
const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    // let token;
    let token = req.headers['x-access-token'].split('Bearer ')[1];

    User.findOne({token}, (err, user) => {
        if (err) throw err;
        if (!user) return res.status(400).json({ isAuth: false, error: true });
        req.token = token
        req.user = {
            uid: user._id,
            fullName: user.fullName,
            email: user.email,
            dpUrl: user.dpUrl
          };
        next();
    })
}

const authGoogle = (req, res, next) => {
    let { _id, fullName, dpUrl, email} = req.body;
    
    let token = jwt.sign(_id, jwtSecret);
    let data = {
      fullName, dpUrl, email, password: _id, token
    }
    User.findOneAndUpdate({password: _id}, data, {upsert: true, new: true},(err, result) => {
        if (err) {
          console.log(err)
                  res.json({ isAuth: false, error: true });
          } else {
            delete result['password'];
            req.user = result;
            req.token = token;
            next();
          }
    })

//   User.update(key, data, upsert=true)
//     .then(usr => {
//              req.token = token
//              req.user = usr;
//              next();
//     })
//     .catch(err => {
//       res.json({ isAuth: false, error: true });
//     })
}


module.exports = { auth, authGoogle }
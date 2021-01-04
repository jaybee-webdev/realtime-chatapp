
const { User } = require('../models/userModel');
const { Conversation } = require('../models/convoModel');
const { staticUrl } = require('../configs/static');

exports.RegisterUser = async (req, res) => {
  console.log(req.body)
 const user = new User({...req.body, dpUrl: staticUrl + 'noImg.png'});

 await user.save((err, doc) => {

 if (err) {
return res.status(422).json({errors:err})
} else {
 const userData = {
 fullName: doc.fullName,
 email: doc.email,
}

 return res.status(200).json(
 {
 success: true,
 message: 'Successfully Signed Up',
 userData
 }
 )
 }
});
}


exports.LoginUser = (req, res) => {
User.findOne({ 'email': req.body.email }, (err, user) => {
if (!user) {
 return res.status(404).json({ success: false, message: 'User email not found!' });
 } else {
 user.comparePassword(req.body.password, (err, isMatch) => {
 //isMatch is eaither true or false
 if (!isMatch) {
 return res.status(400).json({ success: false, message: 'Wrong Password!' });
} else {
 user.generateToken((err, user) => {
 if (err) {
 return res.status(400).send({ err });
} else {
 const data = {
 uid: user._id,
 fullName: user.fullName,
 email: user.email,
 dpUrl: user.dpUrl
 }
 //saving token to cookie
 res.status(200).json({
  success: true,
  message: 'Successfully Logged In!',
  userData: data,
  token: user.token
  })

//  res.cookie('authToken', user.token).status(200).json(
//  {
//  success: true,
//  message: 'Successfully Logged In!',
//  userData: data,
//  token: 
//  })
}
});
}
});
 }
});
}


exports.LogoutUser = (req, res) => {

}

exports.LoginGoogle = (req, res) => {
  let userData = {
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    dpUrl: req.user.dpUrl
  }
    res.status(200).json({
        success: true,
        message: 'Successfully Logged In!',
        userData,
        token: req.token
        })
}


//get authenticated user details
exports.getUserDetails = (req, res) => {
 res.status(200).json({

   credentials: {
     uid: req.user.uid,
     fullName: req.user.fullName,
     email: req.user.email,
     dpUrl: req.user.dpUrl
   }
   });
  }


  exports.getAllUser = async (req, res) => {
    let userId = req.user.uid;

    await User.find({ _id: { $ne: userId } }, { password: 0, token: 0 }).sort({fullName: 1})
   .then(usr => {
    res.json(usr);
   })
   .catch(err => {
     console.log(err)
     res.status(500).json(err);
   })
  //  console.log(Convos)
  //  console.log(Contacts)
  //  console.log(Users)

    // console.log(arr);
  }
  

  exports.UpdateUser = (req, res) => {
      const uid = req.user.uid
      User.updateOne({_id: uid},req.body)
      .then(a => {
        // console.log(a)
        
      })
      .catch(err => {
        console.log(err)
      })
  }

  exports.UploadDp = (req, res) => {
    const uid = req.user.uid
  let fileName = req.file.filename;
  User.updateOne({_id: uid}, { dpUrl: staticUrl + fileName })
  .then(rs => {
    res.status(201).json({ dpUrl: staticUrl + fileName})
  })
  .catch(err => {
    res.status(400).json(err);
  })
}








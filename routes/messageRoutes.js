const { auth } = require('../middlewares/auth')
const uploadFile = require("../middlewares/upload");
const { newConversation, newMessage, GetConvoList, getConversation, getLastMessage, sendFile, getConvoMembers } = require('../controllers/messageControllers');

module.exports = app => {
  
    var router = require("express").Router();

//Post
router.post('/new/conversation', auth, newConversation);
router.post('/new/message', auth, newMessage);
router.post('/upload/file', 
[auth, uploadFile.single("file")],
sendFile);


//Get
router.get('/get/convoList', auth, GetConvoList);
router.get('/get/conversation', auth, getConversation);
router.get('/get/lastMessage', auth, getLastMessage);
router.get('/get/convoMembers', auth, getConvoMembers);

app.use('/api', router);
  };


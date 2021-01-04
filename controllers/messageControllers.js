const { Conversation } = require('../models/convoModel');
const { Files } = require('../models/filesModel');

//Validators
const { cParticipant } = require('../utils/validators');
const { getChatName, getTimestamp, getMembers, findConvo, findConvoMembers } = require('../utils/helpers');
const { staticUrl } = require('../configs/static');

exports.newConversation = (req, res) => {
    let uid = req.user.uid;
    let { user, chatName, isGroup, roomName } = req.body;
    let members = [{...req.user, isOwner: true}, ...user];
    let arr = isGroup ? [{ fullName: roomName, uid: 'default', dpUrl: staticUrl + 'noImg.png' }] : [req.user,...chatName];
    let cn = [...arr];
    let convData = {
        timestamp: new Date().toISOString(),
        chatName: cn,
        members,
        isGroup,
        conversation: []
    }

    // console.log(req.body)


    Conversation.find({ isGroup: false, members: { $elemMatch: { uid } } })
    .then(rs => {
        
        // console.log(rs.length)
        // console.log(rs)
        let conv =  findConvo(rs, user[0].uid);
        // res.send([])
        if(conv.length === 0 || isGroup){

           return Conversation.create(convData, (err, data) => {
                if(err){
                    console.log(err);
                    res.status(500).send(err)
                } else {
                   let conversationInfo = {
                        chatId: data._id,
                        ...getChatName(data, uid),
                        timestamp: getTimestamp(data)
                    }
                    res.status(201).send(conversationInfo);
                }
            })

        } else {

     let conversationInfo = {
        chatId: conv[0]._id,
        ...getChatName(conv[0], uid),
        timestamp: getTimestamp(conv[0])
    }
   return res.status(201).send(conversationInfo);
        }
    })
    .catch(err => {
        console.log(err)
    })



}

exports.GetConvoList = (req, res) => {
    let uid = req.user.uid;
    // console.log(uid)
    // Conversation.aggregate([
    //     // {"$match": { conversation: { uid: uid }}},
    //     {"$unwind": "$members"},
    //     {"$unwind": "$conversation"},
    //     {"$unwind": "$chatName"},
    //     // {"$unwind": "$conversation.timestamp"},
    //     // {"$project": { "timestamp": "conversation.timestamp" }},
    //     // {"$match": { 'members.uid': uid }},
       
    //     {"$group": {"_id": "$_id",  "chatName": { "$push": "$chatName" }, "conversation": { "$push": "$conversation" }, "members": { "$push": "$members"}}},
    //     {"$sort": {"conversation.timestamp": -1}},
    // ])

        Conversation.find({ members: { $elemMatch: { uid }}})
        .sort({'timestamp': -1})
        .then(data => {
                //     data.sort((b, a) => {
                // if(a.conversation[0] && b.conversation[0]){
                    
                //     return (a.conversation[0].timestamp < b.conversation[0].timestamp) ? - 1 : ((a.conversation[0].timestamp > b.conversation[0].timestamp) ? 1 : 0);
                // } 
                //     });
                    let conversations = [];
                    data.map((conversationData) => {
                        // console.log(conversationData)
                        const conversationInfo = {
                            chatId: conversationData._id,
                            ...getChatName(conversationData, uid),
                            timestamp: getTimestamp(conversationData)
                        }

                        // console.log(conversationInfo)
                        conversations.push(conversationInfo);
                    })
                    res.status(200).json(conversations);
                }
        )
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
        })
  }
  


exports.newMessage = (req, res) => {
    const user  = req.user;
          const { fileData, message} = req.body;
    let messageData = {
        message,
        timestamp:  new Date().toISOString(),
        file: fileData ? {  
            filePath: fileData.filePath,
            fileId: fileData.fileId,
            fileType: fileData.type
         } : null,
         user
    } 

    Conversation.findOneAndUpdate(
        {_id: req.query.id},
        {$push: { conversation: messageData}, 
        $set: { "timestamp" : new Date().toISOString()}},
        {$sort: {"timestamp": -1}, upsert:true, returnNewDocument : true},
        (err, data) => {
            if(err) {
                console.log('Error saving message....')
                console.log(err);

                res.status(500).send(err);
            } else {
                const conversationInfo = {
                    chatId: data._id,
                    ...getChatName(data, user.uid),
                    timestamp: new Date().toISOString()
                }
                res.status(201).send(conversationInfo);
            }
        }
    )
 }


exports.getConversation = (req, res) => {
    const id = req.query.id
    Conversation.find({_id: id},(err, data) => {
            if(err) {
                console.log(err)
                res.status(500).send(err);
            } else {
                res.status(200).send(data);
            }
        })
}

exports.getLastMessage = (req, res) => {
        const id = req.query.id
        Conversation.find({ _id: id})
        .then(data => {
                if(data[0].conversation){
                    data[0].conversation.sort((b, a) => {
                        return (a.timestamp < b.timestamp) ? - 1 : ((a.timestamp > b.timestamp) ? 1 : 0);
                    });
                }

                
                    // convData.sort((a, b) => {
                    //     return (a.timestamp < b.timestamp) ? - 1 : ((a.timestamp > b.timestamp) ? 1 : 0);
                    // });

                    let lastMsg = data[0].conversation[0] ? data[0].conversation[0] : {message: 'You can now transac with each other', timestamp: data[0].timestamp}
                    res.status(200).send(lastMsg);
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(err);
            })
            // Conversation.aggregate([
            //     {$match: { _id: id}},
            //     {$unwind: '$conversation'},
            //     {$project: {_id: 0, "message": 1, 'conversation.timestamp': 1}},
            //     {$sort: { 'conversation.timestamp': 1 }},
            //     {$limit: 5}
            //  ],(err, data) => {
            //             if(err) {
            //                 res.status(500).send(err);
            //             } else {
            //                 // let convData = data[0] ? data[0].conversation : {};
            //                 // console.log(data[0])
            //                 // convData.sort((a, b) => {
            //                 //     return (a.timestamp < b.timestamp) ? - 1 : ((a.timestamp > b.timestamp) ? 1 : 0);
            //                 // });
            //                 // let lastMsg = convData.length !== 0 ? convData[0] : {message: 'You can now transac with each other', timestamp: data[0].timestamp}
            //                 // res.status(200).send(lastMsg);
            //                 console.log(data)
            //                                             res.status(200).send({user:{}});

            //             }
            //         }
            //         )
}

exports.sendFile = (req, res) => {
    const uid = req.user.uid
  let { filename, originalname, size, mimetype } = req.file;
  let fileData = {
      fileName: originalname,
      filePath: staticUrl + filename,
      type: mimetype,
      size
  }

  Files.create(fileData, (err, data) => {
    if(err){
        console.log(err);
        res.status(500).send(err)
    } else {
        res.status(201).send({...fileData, fileId: data._id});
    // res.status(201).json({ dpUrl: staticUrl + fileName})
    }
})
}


exports.getConvoMembers = (req, res) => {
    const id = req.query.id
    Conversation.find({_id: id}, {members: 1},(err, data) => {
            if(err) {
                console.log(err)
                res.status(500).send(err);
            } else {
                if(data[0]){
                    res.status(200).send(data[0].members);
                } else {
                    res.status(200).send([]);
                }
            }
        })
}



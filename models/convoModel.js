const mongoose = require('mongoose');

const convoSchema = mongoose.Schema({

    timestamp: String,
    isGroup:  { type: Boolean, default: false},
    chatName: [ 
        {
            fullName: String,  
            dpUrl: String,
            uid: { type: String, default: 'default'}
        }
    ],
    members: [{
        uid: String,
        fullName: String,
        email: String,
        dpUrl: String,
        isOwner: { type: Boolean, default: false}
    }],
    conversation: [
        {
            message: String,
            timestamp: String,
            file: { 
                filePath: String,
                fileId: String,
                fileType: String
             },
            user: {
                fullName: String,
                email: String,
                dpUrl: String,
                uid: String
            }
        }
    ]
})


const Conversation = mongoose.model('Conversations', convoSchema);
module.exports = { Conversation }

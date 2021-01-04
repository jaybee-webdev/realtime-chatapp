const mongoose = require('mongoose');


const fileSchema = mongoose.Schema({
    fileName: {
        type: String,
        maxlength: 100
       },
    filePath: {
    type: String
    },
    type: {
        type: String
        },
        isDeleted: { type: Boolean, default: false},
    size: {
           type: String
       },
 
})

   
   const Files = mongoose.model('files', fileSchema);

   module.exports = { Files }


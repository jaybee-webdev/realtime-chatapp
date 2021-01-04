const multer = require("multer");
const { fileNamer } = require('../utils/validators');

var storage = multer.diskStorage({

  destination: (req, file, cb) => {
      cb(null, `static`);
  },
  filename: async (req, file, cb) => {
    cb(null, Date.now() + '-' + await fileNamer(file.originalname));
  },
});

var uploadFile = multer({ storage: storage });

module.exports = uploadFile;

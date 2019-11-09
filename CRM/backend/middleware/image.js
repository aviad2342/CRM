const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/userImages");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('@');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name[0] + '@' + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single("userImage");

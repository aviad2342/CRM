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
    cb(error, "backend/albumImages");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split('@');
    const ext = MIME_TYPE_MAP[file.mimetype];
    const albumName = req.body.name.toLowerCase().split(' ');
    cb(null, name[0] + '@' + albumName[0] + '-' +Date.now()+ '.' + ext);
  }
});

module.exports = multer({storage: storage}).array("images");

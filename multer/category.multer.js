const multer = require('multer');
const path = require('path');

const rasmUpload = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    destination: (req, file, cb) => {
        cb(null, "uploadsCategory");
    },
});

let upload = multer({ storage: rasmUpload });

module.exports = upload;

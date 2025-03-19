const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = "../uploadsProduct";

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder)
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, res) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Noto'g'ri fayl turi!"), false); 
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, 
});

module.exports = upload
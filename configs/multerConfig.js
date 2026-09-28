const multer = require("multer");
const path = require('path');
const crypto = require("crypto");

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// Sadece bu türlere izin verilir; uzantı istemcinin dosya adından değil türden belirlenir
const ALLOWED_TYPES = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp"
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${crypto.randomBytes(8).toString("hex")}${ALLOWED_TYPES[file.mimetype]}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES[file.mimetype]) {
        return cb(null, true);
    }
    const err = new Error("Unsupported file type");
    err.status = 400;
    cb(err);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE, files: 1 } });

module.exports = upload;

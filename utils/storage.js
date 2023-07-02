const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

//multer storage for single image upload /addsingle
const storageSingle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `images/usersImages`);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + extension);
  },
});
const uploadSingle = multer({ storage: storageSingle });
//multer storage for multi image upload /addmultiple
const storageMultiple = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `images/usersImages`);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + extension);
  },
});
const uploadMultiple = multer({ storage: storageMultiple });

//multer for registration
const storageRegister = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/avatars");
  },
  filename: function (req, file, cb) {
    try {
      const uniqueName = uuidv4();
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, uniqueName + extension);
    } catch (err) {
      console.log(err);
    }
  },
});
const uploadRegister = multer({ storage: storageRegister });
//multer for edit profile
const storageEditProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/avatars");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName + extension);
  },
});
const uploadEditProfile = multer({ storage: storageEditProfile });
module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadRegister,
  uploadEditProfile,
};

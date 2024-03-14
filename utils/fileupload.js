const multer = require("multer");

const storagekey = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "images");
  },
});

const upload = multer({
  storage: storagekey,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single("pimage");

module.exports = upload;

// multiple image uploader

// const multer = require("multer");

// const storagekey = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
// });

// const upload = multer({
//   storage: storagekey,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   },
// }).array("pimage", 5);

// module.exports = upload;

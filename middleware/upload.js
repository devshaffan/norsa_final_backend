

const multer = require("multer");
const path = require("path");
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
// const multer = require('multer')
// const path = require('path')

// var storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//     callBack(null, './public/images/')     // './public/images/' directory name where save the file
//   },
//   filename: (req, file, callBack) => {
//     //console.log("the file is " + file)
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       var message = `${file.originalname} is invalid. Only accept png.`;
//       return callBack(message, null);
//     }
//     callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// })

// var upload = multer({
//   storage: storage
// });
// module.exports = upload;




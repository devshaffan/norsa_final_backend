const express = require('express');
const router = express.Router();
const clientProfilePicture = require('../controllers/clientProfilePicture');
const upload = require("../middleware/upload");


// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './app/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname)
//     }
//   })


router.post('/createImage', upload.single("file"), clientProfilePicture.createImage)
module.exports = router;

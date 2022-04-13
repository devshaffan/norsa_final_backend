const express = require('express');
const router = express.Router();
const clientProofOfAddress = require('../controllers/clientProofOfAddress');
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


router.post('/createFile', upload.single("file"), clientProofOfAddress.createFile)
module.exports = router;

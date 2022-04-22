const express = require('express');
const router = express.Router();
const clientProofOfAddress = require('../controllers/clientProofOfAddress');
const uploadPdf = require('../middleware/uploadPdf');


// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './app/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname)
//     }
//   })


router.post('/createFile', uploadPdf.single("file"), clientProofOfAddress.createFile)
module.exports = router;

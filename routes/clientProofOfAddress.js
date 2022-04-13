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
// router.get('/getImageById/:id', clientProofOfAddress.getImageById);
router.get('/getFileByClientId/:id', clientProofOfAddress.getFileByClientId);
router.post('/createFile', uploadPdf.single("file"), clientProofOfAddress.createFile)
router.delete('/delete/:Client_id', clientProofOfAddress.delete);

module.exports = router;

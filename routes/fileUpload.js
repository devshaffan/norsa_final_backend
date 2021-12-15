const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/clientBankStatement');
const uploadPdf = require("../middleware/uploadPdf");


// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './app/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname)
//     }
//   })
router.post('/add', uploadPdf.fields([{
    name: 'file1', maxCount: 1
}, {
    name: 'file2', maxCount: 1
}]), fileUpload.addFile)

// router.post('/add1', uploadPdf.single("file1"), fileUpload.addFile)
module.exports = router;

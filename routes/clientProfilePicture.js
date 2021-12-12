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
router.get('/getImageById/:id', clientProfilePicture.getImageById);
router.get('/getImageByClientId/:id', clientProfilePicture.getImageByClientId);
router.post('/createImage',upload.single("file"),clientProfilePicture.createImage)
router.delete('/delete/:Client_id', clientProfilePicture.delete);

module.exports = router;

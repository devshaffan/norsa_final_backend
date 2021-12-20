const express = require('express');
const router = express.Router();
const fileUpload = require('../controllers/clientBankStatement');
const uploadPdf = require("../middleware/uploadPdf");



router.post('/add', uploadPdf.fields([{
    name: 'file1', maxCount: 1
}, {
    name: 'file2', maxCount: 1
}]), fileUpload.addFile)
// router.get('/getFile1ByClientId/:id', fileUpload.getFile1ByClientId);
// router.get('/getFile2ByClientId/:id', fileUpload.getFile2ByClientId);
router.get('/getFilesByClientId/:id', fileUpload.getFilesByClientId)
router.delete('/delete/:Client_id', fileUpload.delete);


module.exports = router;

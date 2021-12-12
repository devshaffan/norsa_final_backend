const express = require('express');
const router = express.Router();
const device = require('../controllers/device');


router.get('/getAllDevices', device.getAllDevices);
router.get('/getAllDevices/:limit&:offset', device.getAllDevices);
router.get('/getDeviceById/:id', device.getDeviceById);
router.post('/createDevice', device.createDevice);
router.post('/upsertDevice', device.upsertDevice);
router.delete('/deleteDevice/:id', device.deleteDevice);
module.exports = router;

const express = require('express');
const router = express.Router();
const clients = require('../controllers/clients');
const multer = require('multer')



router.post('/upsertClient', clients.upsertClient);
router.post('/createClient', clients.createClient);
router.get('/getActiveClientList', clients.getAllActiveClients)
router.get('/getNextK_Id', clients.getNextK_Id);
router.get('/getNextNK_Id', clients.getNextNK_Id);


module.exports = router;

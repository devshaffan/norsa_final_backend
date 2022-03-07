const express = require('express');
const router = express.Router();
const clients = require('../controllers/clients');
const multer = require('multer')


//multer({ storage }).single('example'),
router.get('/getAllClients/:limit&:offset', clients.getAllClients);
router.get('/getAllClients', clients.getAllClients);
router.get('/getAllClientsByDealer/:Dealer_id', clients.getAllClientsByDealer);
router.get('/getNextD_Id', clients.getNextD_Id);
router.get('/getAllActiveClients', clients.getAllActiveClients);
router.get('/getAllActiveAllClients', clients.getAllActiveAllClients);
router.get('/getClientById/:id', clients.getClientById);
router.get('/checkSedulaExist/:idCard', clients.checkSedulaExist)
router.post('/createClient', clients.createClient);
router.post('/upsertClient', clients.upsertClient);
router.delete('/deleteClient/:id', clients.deleteClient);
module.exports = router;

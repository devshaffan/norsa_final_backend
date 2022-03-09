
const express = require('express');
const router = express.Router();
const dealerBulkPayment = require('../controllers/dealerBulkPayment');


router.get('/getAll', dealerBulkPayment.getAll);
router.get('/getById/:id', dealerBulkPayment.getById);
router.post('/create', dealerBulkPayment.create);
router.post('/update', dealerBulkPayment.update);
router.delete('/delete/:id', dealerBulkPayment.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const amountPaid = require('../controllers/amountPaid');


router.get('/getAllAmountPaid',amountPaid.getAllAmountPaid);
router.get('/getAmountPaidById/:id',amountPaid.getAmountPaidById);
router.post('/createAmountPaid',amountPaid.createAmountPaid);
router.post('/createAmountPaid',amountPaid.createAmountPaid);
router.put('/updateAmountPaid',amountPaid.updateAmountPaid);
router.delete('/deleteAmountPaid/:id',amountPaid.deleteAmountPaid);

module.exports = router;

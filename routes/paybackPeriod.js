const express = require('express');
const router = express.Router();
const paybackPeriod = require('../controllers/paybackPeriod');


router.get('/getPaybackPeriods',paybackPeriod.getPaybackPeriods);
router.get('/getPaybackPeriodById/:id',paybackPeriod.getPaybackPeriodById);
router.get('/getPaybackPeriodByIssuanceHistory/:issuanceHistory_Id',paybackPeriod.getPaybackPeriodByIssuanceHistory);
router.post('/createPaybackPeriod',paybackPeriod.createPaybackPeriod);
router.put('/updatePaybackPeriod',paybackPeriod.updatePaybackPeriod);
router.delete('/deletePaybackPeriod/:id',paybackPeriod.deletePaybackPeriod);

module.exports = router;

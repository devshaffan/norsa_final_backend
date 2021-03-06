const express = require('express');
const router = express.Router();
const th = require('../controllers/transectionHistory');

router.get('/getAllTransactionHistory/:limit&:offset', th.getAllTransactionHistory);
router.get('/getAllTransactionHistory', th.getAllTransactionHistory);
router.get('/getTransactionHistoryById/:id', th.getTransactionHistoryById);
router.get('/searchTransactions', th.searchTransactions);
router.post('/createTransactionHistory', th.createTransactionHistory);
router.post('/bulkCreateTransectionHistory', th.bulkCreateTransectionHistory);
router.delete('/deleteTransectionById/:id', th.deleteTransectionById);
router.put('/updateTransection/:id', th.updateTransection);
router.get('/getTodaysTransactions', th.getTodaysTransactions);
router.get('/getMerchantsTodaysTransactions', th.getMerchantsTodaysTransactions);
router.get('/getTransactionHistoryByClientId/:id', th.getTransactionHistoryByClientId);
router.get('/sumByIssuanceHistoryId/:id',th.sumByIssuanceHistoryId)
module.exports = router;

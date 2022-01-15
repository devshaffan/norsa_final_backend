const express = require('express');
const router = express.Router();
const multipleIssueances = require('../controllers/multipleIssueances');

router.get('/getAllByIssuancesId/:issuancesId', multipleIssueances.getAllByIssuancesId);
router.get('/getAllByMerchantId/:merchantId', multipleIssueances.getAllByMerchantId);
router.post('/createMultipleIssueances', multipleIssueances.createMultipleIssueances);
router.put('/updateMultipleIssueances', multipleIssueances.updateMultipleIssueances);
router.delete('/deleteMultipleIssueances/:id', multipleIssueances.deleteMultipleIssueances);
module.exports = router;

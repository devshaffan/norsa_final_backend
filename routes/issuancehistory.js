const express = require('express');
const router = express.Router();
const issuancehistory = require('../controllers/issuancehistory');


router.get('/getAllIssuancehistories/:limit&:offset', issuancehistory.getAllIssuancehistories);
router.get('/getAllIssuancehistories', issuancehistory.getAllIssuancehistories);
router.get('/getAllIssuancehistoriesByAmountPaid', issuancehistory.getAllIssuancehistoriesByAmountPaid);

router.get('/getIssuancehistoryById/:id', issuancehistory.getissuancehistoryById);
router.get('/getIssuanceHistoryByClientId/:Client_id', issuancehistory.getissuancehistoryByClientId)
router.get('/getissuancehistoryByPincodeAndNfcCard_id/:Pincode&:NfcCard_id',issuancehistory.getissuancehistoryByPincodeAndNfcCard_id)
router.post('/createIssuancehistory', issuancehistory.createIssuancehistory);
router.post('/upsertIssuancehistory', issuancehistory.upsertIssuancehistory);
router.delete('/deleteIssuancehistory/:id', issuancehistory.deleteIssuancehistory);
module.exports = router;

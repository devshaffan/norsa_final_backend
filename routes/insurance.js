
const express = require('express');
const router = express.Router();
const insurance = require('../controllers/insurance');


router.get('/getAllInsurance/:limit&:offset', insurance.getAllInsurance);
router.get('/getAllInsurance', insurance.getAllInsurance);
router.get('/getInsuranceById/:id', insurance.getInsuranceById);
router.post('/createInsurance', insurance.createInsurance);
router.post('/updateInsurance/:id', insurance.updateInsurance);
router.delete('/deleteInsurance/:id', insurance.deleteInsurance);
router.get('/getInsuranceAmountByIssuanceHistoryId/:id', insurance.getInsuranceAmountByIssuanceHistoryId);


module.exports = router;

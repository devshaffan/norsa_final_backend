const express = require('express');
const router = express.Router();
const merchantGroup = require('../controllers/merchantGroup');

router.get('/getMerchantsByUser/:userId', merchantGroup.getMerchantsByUser);
router.get('/getAvailaibleMerchants/:userId', merchantGroup.getAvailaibleMerchant)
router.delete('/forfeitMerchant/:id', merchantGroup.forfeitMerchant)
router.post('/addMerchantsToGroup', merchantGroup.addMerchantsToGroup)
module.exports = router
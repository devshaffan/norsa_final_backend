const express = require('express');
const router = express.Router();
const merchants = require('../controllers/merchants');


router.get('/getAllMerchants/:limit&:offset', merchants.getAllMerchants);
router.get('/getAllMerchants', merchants.getAllMerchants);
router.get('/getMerchantById/:id', merchants.getMerchantById);
router.post('/createMerchant', merchants.createMerchant);
router.post('/upsertMerchant', merchants.upsertMerchant);
router.delete('/deleteMerchant/:id', merchants.deleteMerchant);

router.get('/getMerchantNameByUserId', merchants.getMerchantNameByUserId);
router.get('/getAllMerchantTypes/:limit&:offset', merchants.getAllMerchantTypes);
router.get('/getAllMerchantTypes', merchants.getAllMerchantTypes);
router.get('/getMerchantTypeById/:id', merchants.getMerchantTypeById);
router.post('/createMerchantType', merchants.createMerchantType);
router.post('/upsertMerchantType', merchants.upsertMerchantType);
router.delete('/deleteMerchantType/:id', merchants.deleteMerchantType);

router.get('/getAllMerchantTypeDiscounts/:limit&:offset', merchants.getAllMerchantTypeDiscounts);
router.get('/getAllMerchantTypeDiscounts', merchants.getAllMerchantTypeDiscounts);
router.get('/getMerchantTypeDiscountByMerchantType_id/:MerchantType_id', merchants.getMerchantTypeDiscountByMerchantType_id);


router.get('/getMerchantTypeDiscountById/:id', merchants.getMerchantTypeDiscountById);
router.post('/createMerchantTypeDiscount', merchants.createMerchantTypeDiscount);
router.post('/upsertMerchantTypeDiscount', merchants.upsertMerchantTypeDiscount);
router.delete('/deleteMerchantTypeDiscount/:id', merchants.deleteMerchantTypeDiscount);
router.delete('/deleteMerchantTypeDiscountByMerchantType_id/:id', merchants.deleteMerchantTypeDiscountByMerchantType_id);


module.exports = router;

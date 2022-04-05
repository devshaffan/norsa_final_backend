const express = require('express');
const router = express.Router();
const model = require('../controllers/dailySalesPrintCheck');


router.get('/getAll', model.getAll);
router.get('/getBy/:id', model.getById);
router.get('/getByMerchantId/:merchantId', model.getByMerchantId);

router.post('/create', model.create);
router.post('/update', model.update);
router.post('/update/:merchantId', model.updateByMerchantId);

module.exports = router;

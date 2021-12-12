const express = require('express');
const router = express.Router();
const dealer = require('../controllers/dealer');


router.get('/getAlldealers/:limit&:offset', dealer.getAllDealers);
router.get('/getAlldealers', dealer.getAllDealers);
router.get('/getDealerById/:id', dealer.getDealerById);
router.post('/createDealer', dealer.createDealer);
router.post('/upsertDealer', dealer.upsertDealer);
router.delete('/deleteDealer/:id', dealer.deleteDealer);
module.exports = router;

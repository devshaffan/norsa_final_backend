const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboard')


router.get('/topThreeMerchantsByTransaction', dashboard.topThreeMerchantsByTransaction)
router.get('/monthlyTotalProfit', dashboard.monthlyTotalProfit)
router.get('/currentDateTransaction', dashboard.currentDateTransaction)
router.get('/paidByClientToday', dashboard.paidByClientToday)
router.get('/todaysTotalProfit', dashboard.todaysTotalProfit)
router.get('/todaysTransaction', dashboard.todaysTransaction)

module.exports = router;

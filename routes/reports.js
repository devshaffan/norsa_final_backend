const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports')

router.get('/merchant/:date', reports.merchantReport)
router.get('/transaction/:merchants&:date', reports.transactionReport)
router.get('/totalSales/:users&:date', reports.totalSales)
router.get('/totalSalesOfCurrentUser/:date', reports.totalSalesOfCurrentUser)
router.get('/dealerReport/:dealers&:month', reports.dealerReport)

module.exports = router;

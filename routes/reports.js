const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports')

router.get('/merchant/:date', reports.merchantReport)
router.get('/supermarket/:date', reports.supermarketReport)
router.get('/transaction/:merchants&:dateFrom&:dateTo', reports.transactionReport)
router.get('/totalSales/:users&:date', reports.totalSales)
router.get('/totalSalesOfCurrentUser/:date', reports.totalSalesOfCurrentUser)
router.get('/dealerReport/:dealers&:month&:type', reports.dealerReport)
router.get('/insuranceReport/:clients&:month', reports.insuranceReport)
router.get('/membershipReport/:clients', reports.membershipFeeReport)

module.exports = router;

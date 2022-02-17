const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports')

router.get('/merchant/:date',reports.merchantReport)
router.get('/transaction',reports.transactionReport)

module.exports = router;

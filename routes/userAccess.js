const express = require('express');
const router = express.Router();
const userAccess = require('../controllers/userAccess');


router.post('/checkAdminStatus', userAccess.checkAdminStatus);
router.post('/changeUserStatus', userAccess.changeUserStatus);
router.post('/dormantUser', userAccess.dormantUser);

module.exports = router;

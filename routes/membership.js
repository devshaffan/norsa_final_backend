const express = require('express');
const router = express.Router();
const membership = require('../controllers/membership');

router.get('/getAllMembership/:limit&:offset', membership.getAllMembership);
router.get('/getAllMembership', membership.getAllMembership);
router.get('/getAllMembershipByClientId/:clientId', membership.getAllMembershipByClientId);
router.get('/getMembershipById/:id', membership.getMembershipById);
router.post('/createMembership', membership.createMembership);
router.post('/updateMembership/:id', membership.updateMembership);
router.delete('/deleteMembership/:id', membership.deleteMembership);

module.exports = router;
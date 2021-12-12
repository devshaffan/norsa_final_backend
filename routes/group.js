
const express = require('express');
const router = express.Router();
const group = require('../controllers/group');

router.get('/getAllGroups', group.getAllGroups);
router.get('/getGroupByClientId/:id', group.getGroupByClientId);
router.get('/getGroupById/:id', group.getGroupById);
router.post('/createGroup', group.createGroup);
router.post('/upsertGroup', group.upsertGroup);
router.delete('/deleteGroup/:id', group.deleteGroup);


module.exports = router;

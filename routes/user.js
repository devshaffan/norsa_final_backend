const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.get('/getAllUsers', user.getAllUsers);
router.get('/getAllNotMerchants', user.getAllNotMerchants)
router.get('/getAllMerchants', user.getAllMerchants)
router.delete('/delete/:id', user.deleteUser)
router.post('/update/:id', user.updateUser)
router.get('/getUserById/:id', user.getUserById)
router.get('/getUserByEmail/:email', user.getUserByEmail)
router.post('/setUserRole/:id', user.setUserRole)

module.exports = router;

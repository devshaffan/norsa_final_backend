const express = require('express');
const router = express.Router();
const nfcCard = require('../controllers/nfcCard');

router.get('/getAllNfcCards/:limit&:offset', nfcCard.getAllNfcCards);
router.get('/getAllNfcCards', nfcCard.getAllNfcCards);
router.get('/getNfcCardById/:id', nfcCard.getNfcCardById);
router.post('/createNfcCard', nfcCard.createNfcCard);
router.post('/upsertNfcCard', nfcCard.upsertNfcCard);
router.delete('/deleteNfcCard/:id', nfcCard.deleteNfcCard);
module.exports = router;

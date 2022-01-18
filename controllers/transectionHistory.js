const models = require('../models/index');
const uuidV4 = require('uuid/v4');
exports.getTransactionHistoryById = (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.findById(id).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.createTransactionHistory = (req, res) => {
    const {Client_id,
      Merchant_ID,
      ItemDescription,
      dateTime,
      AmountUser} = req.body;
      
    if(!Client_id || !Merchant_ID || !ItemDescription || !dateTime || !AmountUser){
        res.status(400).send({
            message: 'data is required'
        });
    }
    models.transactionhistory.create({id:uuidV4(),Client_id,
        Merchant_ID,
        ItemDescription,
        dateTime,
        AmountUser}).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.bulkCreateTransectionHistory = (req, res) => {
    const {Client_id,
      Merchant_ID,
      ItemDescription,
      dateTime,
      AmountUser} = req.body;
    if(!Client_id || !Merchant_ID || !ItemDescription || !dateTime || !AmountUser){
        res.status(400).send({
            message: 'data is required'
        });
    }
    models.transactionhistory.bulkCreate(req.body).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.getAllTransactionHistory = (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 1000;
    const offset = req.params.offset !== undefined ? req.params.limit : 0;

    models.transactionhistory.findAll({limit, offset}).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.deleteTransectionById= (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.destroy({where: {
        id
    }}).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.updateTransection= (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.update(req.body, {where: {
        id
    }}).then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.searchTransections= (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 1000;
    const offset = req.params.offset !== undefined ? req.params.limit : 0;
    
};
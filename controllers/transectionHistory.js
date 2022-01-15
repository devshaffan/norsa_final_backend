const models = require('../models/index');

exports.getTransactionHistoryById = (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transectionHistory.findById(id).then(data => {
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
    models.transectionHistory.create(req.body).then(data => {
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
    models.transectionHistory.bulkCreate(req.body).then(data => {
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

    models.transectionHistory.findAll({limit, offset}).then(data => {
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
    models.transectionHistory.destroy({where: {
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
    models.transectionHistory.update(req.body, {where: {
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

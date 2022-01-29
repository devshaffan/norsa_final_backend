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
      AmountUser,
      issuancehistoryId }= req.body;
      
    if(!Client_id || !Merchant_ID || !ItemDescription || !dateTime || !AmountUser){
        res.status(400).send({
            message: 'data is required'
        });
    }
    models.transactionhistory.create({id:uuidV4(),Client_id,
        Merchant_ID,
        ItemDescription,
        dateTime,
        AmountUser,  issuancehistoryId}).then(data => {
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
      AmountUser , issuancehistoryId} = req.body;
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
exports.searchTransactions= (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 10000;
    const offset = req.params.offset !== undefined ? req.params.limit : 0;
    models.sequelize.query(`SELECT t.id id , t.ItemDescription ItemDescription , t.dateTime 'dateTime' , t.AmountUser AmountUser , c.id AS 'client_Id' , c.FirstName FirstName , 
    c.LastName LastName , m.id merchant_Id, m.Name 'Name' , m.Email 'Merchant_Email'
    FROM transactionhistory t
    JOIN client c ON c.id = t.Client_id
    JOIN merchants m ON m.id = t.Merchant_ID
    LIMIT ${limit} OFFSET ${offset} `,{type:models.sequelize.QueryTypes.SELECT})
    .then(data => {
        res.json({ message: 'success', data});
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.getTodaysTransactions = (req, res) => {

    models.sequelize.query(`SELECT * FROM transactionhistory t
    WHERE Date(t.dateTime) = CURDATE()`,{type:models.sequelize.QueryTypes.SELECT}).then((data)=>{
        res.json({ message : 'success', data })
    }).catch((err)=>{
        res.status(500).send({
            message: 'error', error: err
        });
    });
};
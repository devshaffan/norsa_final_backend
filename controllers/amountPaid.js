const models = require('../models/index');
const uuidV4 = require('uuid/v4');
exports.getAllAmountPaid = (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 10000;
    const offset = req.params.offset !== undefined ? req.params.limit : 0;
    models.amountPaid.findAll({ limit, offset }).then((data) => {
        res.json({message: "success", data: data})
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving All clients.',
        });
    });
};
exports.getAmountPaidById = (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: "id is required"
        });
    }
    models.amountPaid.findOne({
        where: {
            id
        }
    }).then((data) => {
        res.json({message: "success", data: data});
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving All clients.',
        });
    });
};
exports.createAmountPaid = (req, res) => {
    const body = req.body;
    if(!body.issuanceHistory_Id){
        res.status(400).send({
            message: "issuanceHistory_Id is required"
        });
    }
    models.amountPaid.create({
        id: uuidV4(),
        issuanceHistory_Id: body.issuanceHistory_Id,
        amount: body.amount,
        status: body.status,
        date: body.date
    }).then((data) => {
        res.json({message: "success", data: data});
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving All clients.',
        });
    });
};
exports.updateAmountPaid = (req, res) => {
    const body = req.body;
    if(!body.id){
        res.status(400).send({
            message: "id is required"
        });
    }
    models.amountPaid.update(
        {
            issuanceHistory_Id: body.issuanceHistory_Id,
            amount: body.amount,
            status: body.status,
            date: body.date
        },
        {
            where: {
                id: body.id
            }
        }
    ).then((data) => {
        res.json({message: "success", data: data});
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving All clients.',
        });
    });
};
exports.deleteAmountPaid = (req, res) => {
    const id = req.params.id;
    if(!id){
        res.status(400).send({
            message: "id is required"
        });
    }
    models.amountPaid.destroy({
        where: {
            id
        }
    }).then((data) => {
        res.json({message: "success", data: data});
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || 'Some error occurred while retrieving All clients.',
        });
    });
};

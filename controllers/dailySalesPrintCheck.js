const models = require('../models/index');
const uuidV4 = require('uuid/v4');


exports.getAll = (req, res) => {
    const limit = req.params.limit ? null : 10000;
    const offset = req.params.offset ? null : 0;
    models.dailysalesprintcheck
        .findAll({ limit, offset })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving All group.',
            });
        });
};

exports.getById = (req, res) => {
    models.dailysalesprintcheck
        .findByPk(req.params.id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving group Record .',
            });
        });
};

exports.getByMerchantId = (req, res) => {
    if (!req.params || !req.params.merchantId) {
        res.status(500).send({
            message:
                 'Merchant Id cannot be null',
        });
        return
    }
    models.dailysalesprintcheck
        .findOne({
            where: {
                merchantId: req.params.merchantId
            }
        })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving group Record .',
            });
        });
};

exports.create = (req, res) => {
    const data = { ...req.body, id: uuidV4() }
    models.dailysalesprintcheck
        .create(data)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the dealer.',
            });
        });
};

exports.update = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    models.dailysalesprintcheck
        .upsert(req.body)
        .then(data => {
            res.status(200).send({ success: true, data: data })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the dealer.',
            });
        })
}

exports.updateByMerchantId = (req, res) => {
    if (!req.params || !req.params.merchantId) {
        res.status(500).send({
            message:
                'Merchant Id cannot be null',
        });
        return
    }
    models.dailysalesprintcheck
        .update(req.body, {
            where:
            {
                merchantId: req.params.merchantId
            }
        })
        .then(data => {
            res.status(200).send({ success: true, data: data })
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the dealer.',
            });
        })
}
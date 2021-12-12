const models = require('../models/index');

exports.getAllGroups = (req, res) => {
    const limit = req.params.limit ? null : 10000;
    const offset = req.params.offset ? null : 0;
    models.group
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

exports.getGroupById = (req, res) => {
    models.group
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

exports.getGroupByClientId = (req, res) => {
    models.group
        .findAll({
            where: {
                Client_id: req.params.id
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

exports.createGroup = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    models.group
        .create(req.body)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the group.',
            });
        });
};

exports.upsertGroup = (req, res) => {

    if (!req.body.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    models.group
        .upsert(req.body)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the group.',
            });
        });
};

exports.deleteGroup = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.group
        .destroy({
            where: {
                id
            },
        })
        .then((num) => {
            if (num === 1) {
                res.send({ message: 'group was deleted successfully!' });
            } else {
                res.send({
                    message: `Cannot delete group with id=${id}. Maybe group was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while Deleting group.',
            });
        });
};

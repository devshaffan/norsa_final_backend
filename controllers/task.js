const models = require('../models/index');
const uuidV4 = require('uuid/v4');

exports.getAllTasks = (req, res) => {
    models.task
        .findAll()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving All device.',
            });
        });
};


exports.getTaskById = (req, res) => {
    models.task
        .findByPk(req.params.id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving device Record .',
            });
        });
};

exports.create = (req, res) => {
    const data = { ...req.body, id: uuidV4() }
    
    models.task
        .create(data)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the device.',
            });
        });
};

exports.upsertTask = (req, res) => {

    if (!req.body.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    models.task
        .upsert(req.body)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the device.',
            });
        });
};

exports.deleteTask = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.task
        .destroy({
            where: {
                id
            },
        })
        .then((num) => {
            if (num === 1) {
                res.send({ message: 'device was deleted successfully!' });
            } else {
                res.send({
                    message: `Cannot delete Device with id=${id}. Maybe device was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while Deleting device.',
            });
        });
};

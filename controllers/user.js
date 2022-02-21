const models = require('../models/index');

exports.getAllUsers = (req, res) => {
    const limit = req.params.limit ? null : 10000;
    const offset = req.params.offset ? null : 0;
    models.user
        .findAll({ limit, offset })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving All nfcCard.',
            });
        });
};

exports.deleteUser = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.user
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
                    message: `Cannot delete Device with id=${id}. Maybe user was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while Deleting device.',
            });
        });
}
exports.getUserById = (req, res) => {
    // const clientId = req.params.id;
    // //console.log('id is ', Number.parseInt(clientId, 10));
    models.user
        .findByPk(req.params.id)
        .then((data) => {
            //console.log(data);
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving CLient Record .',
            });
        });
};

exports.getUserByEmail= (req, res) => {
    // const clientId = req.params.id;
    // //console.log('id is ', Number.parseInt(clientId, 10));
    models.user
        .find({
            where : {
                email : req.params.email
            }
        })
        .then((data) => {
            //console.log(data);
            res.json(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving CLient Record .',
            });
        });
};

exports.updateUser = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.user
        .update(
            {
                email: req.body.email
            },
            {
                where: {
                    id
                }
            }
        ).then((data) => {
            res.json(data)
        })
        .catch((err) => {
            res.json(err)
        })
}



exports.setUserRole = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.user
        .update(
            {
                isAdmin: req.body.isAdmin
            },
            {
                where: {
                    id
                }
            }
        ).then((data) => {
            res.json(data)
        })
        .catch((err) => {
            res.json(err)
        })
}
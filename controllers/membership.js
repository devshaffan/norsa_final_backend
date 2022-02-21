const models = require('../models/index');
const uuidV4 = require('uuid/v4');

exports.getAllMembership = (req, res) => {

    const limit = parseInt(req.params.limit, 10) || 10;
    const offset = parseInt(req.params.offset, 10)|| 0;
    models.membership.findAll({
        limit,
        offset,
    }).then(membership => {
        res.status(200).send({result:'ok',data:membership});
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while retrieving membership."
        });
    });
};

exports.getAllMembershipByClientId = (req, res) => {

    if(!req.params.clientId){
        return res.status(400).send({
            result: 'error',
            message: 'Client id is required'
        });
    }
    models.membership.findAll({
        where: {
            clientFk: req.params.clientId
        }
    }).then(membership => {
        res.status(200).send({result:'ok',data:membership});
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while retrieving membership."
        });
    });
};

exports.getMembershipById = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership id is required'
        });
    }
    models.membership.findByPk(req.params.id).then(membership => {
        if (!membership) {
            return res.status(404).send({
                result: 'error',
                message: "Membership not found with id " + req.params.id
            });
        }
        res.send({result:'ok',data:membership});
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                result: 'error',
                message: "Membership not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            result: 'error',
            message: "Error retrieving membership with id " + req.params.id
        });
    });
};

exports.createMembership = (req, res) => {
    // Validate request
    if(!req.body.amount) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership amount is required'
        });
    }
    if(!req.body.month) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership month is required'
        });
    }
    if(!req.body.clientFk) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership clientFk is required'
        });
    }
    const body = req.body;
    body.id = uuidV4();
    models.membership.create(body).then(membership => {
        res.send({result:'ok',data:membership});
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while creating membership."
        });
    });
};

exports.updateMembership = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership id is required'
        });
    }
    const body = req.body;
    models.membership.update(body, {
        where: {
            id: req.params.id
        }
    }).then(membership => {
        res.send({result:'ok',data:membership});
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while updating membership."
        });
    });
};

exports.deleteMembership = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Membership id is required'
        });
    }
    models.membership.destroy({
        where: {
            id: req.params.id
        }
    }).then(num => {
        if (num == 1) {
            res.send({result:'ok',data:req.params.id});
        } else {
            res.send({
                result: 'error',
                message: `Cannot delete membership with id=${req.params.id}. Maybe membership was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: "Could not delete insurance with id=" + req.params.id
        });
    });
}
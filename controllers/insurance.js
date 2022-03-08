const models = require('../models/index');
const uuidV4 = require('uuid/v4');
models.insurance.belongsTo(models.issuancehistory, {foreignKey: 'issuanceHistoryFk'});
exports.getAllInsurance = (req, res) => {
    const limit = parseInt(req.params.limit, 10)|| 10;
    const offset = parseInt(req.params.offset, 10)|| 0;
    models.insurance.findAll({
        limit,
        offset,
    }).then(insurance => {
        res.status(200).send({result:'ok',data:insurance});
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while retrieving insurance."
        });
    });
};

exports.getInsuranceById = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Insurance id is required'
        });
    }
    models.insurance.findByPk(req.params.id).then(insurance => {
        if (!insurance) {
            return res.status(404).send({
                result: 'error',
                message: "Insurance not found with id " + req.params.id
            });
        }
        res.send({result:'ok',data:insurance});
    }).catch(err => {
        if (err.kind === 'ObjectId') {
            return res.status(404).send({
                result: 'error',
                message: "Insurance not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            result: 'error',
            message: "Error retrieving insurance with id " + req.params.id
        });
    });
};

exports.createInsurance = (req, res) => {
    // Validate request
    if(!req.body.amount) {
        return res.status(400).send({
            result: 'error',
            message: 'Insurance amount is required'
        });
    }
    if(!req.body.tax) {
        return res.status(400).send({
            result: 'error',
            message: 'Insurance tax is required'
        });
    }
    if(!req.body.issuanceHistoryFk) {
        return res.status(400).send({
            result: 'error',
            message: 'Issuance history id is required'
        });
    }
    // Create a Insurance
    const insurance = req.body;
    insurance.id = uuidV4();
    models.insurance.create(insurance)
        .then(data => {
            res.send({result:'ok',data:data});
        }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: err.message || "Some error occurred while creating the Insurance."
        });
    });
};

exports.updateInsurance = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Insurance id is required'
        });
    }
    const insurance = {
        amount: req.body.amount,
        tax: req.body.tax,
        issuanceHistoryId: req.body.issuancehistoryId
    };
    models.insurance.update(insurance, {
        where: {id: req.params.id}
    }).then(num => {
        if (num == 1) {
            res.send({result:'ok',data:insurance});
        } else {
            res.send({
                result: 'error',
                message: `Cannot update insurance with id=${req.params.id}. Maybe insurance was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: "Error updating insurance with id=" + req.params.id
        });
    });
};

exports.deleteInsurance = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            result: 'error',
            message: 'Insurance id is required'
        });
    }
    models.insurance.destroy({
        where: {id: req.params.id}
    }).then(num => {
        if (num == 1) {
            res.send({result:'ok',data:req.params.id});
        } else {
            res.send({
                result: 'error',
                message: `Cannot delete insurance with id=${req.params.id}. Maybe insurance was not found!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            result: 'error',
            message: "Could not delete insurance with id=" + req.params.id
        });
    });
}
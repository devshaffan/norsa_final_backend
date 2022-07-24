const models = require('../models/index')
const uuidV4 = require('uuid/v4');
const _ = require('lodash');

exports.getMerchantsByUser = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) {
            res.status(500).send({
                message: "no User Selected"
            })
            return
        }
        const userMerchant = (await getAllUserMerchants(userId)).map(item => item.merchantId)
        const merchants = await models.merchants.findAll({
            where: {
                id: userMerchant
            },
            attributes: ['id', 'Name']
        })
        res.status(200).send(merchants)
    }
    catch {
        (err => {
            res.status(500).send({
                message:
                    err.message || "Not Succesful"
            })
        })
    }
}
const getAllMerchants = async () => {
    return await models.merchants.findAll({
        attributes: ['id', 'Name']
    })
}
const getAllUserMerchants = async (userId) => {
    return await models.merchantGroup.findAll({
        where: {
            User_id: userId
        }
    })
}
exports.getAvailaibleMerchant = async (req, res) => {
    const userId = req.params.userId
    if (!userId) {
        res.status(500).send({
            message: "no User Selected"
        })
        return
    }
    const userMerchant = (await getAllUserMerchants(userId)).map(item => item.merchantId)
    const merchants = await getAllMerchants()
    const userMerchantSet = new Set(userMerchant)
    const availableMerchants = merchants.filter((item) => {
        if (userMerchantSet.has(item.id)) {
            return false
        }
        return true
    })

    res.status(200).send(availableMerchants)
}

exports.addMerchantsToGroup = async (req, res) => {
    const merchants = req.body.merchants
    const userId = req.body.userId
    if (!merchants || merchants.length == 0 || !userId) {
        res.status(500).send({
            message: "no Merchant or User Selected"
        })
        return
    }
    try {
        for (let i = 0; i < merchants.length; i++) {
            const body = {
                id: uuidV4(),
                merchantId: merchants[i],
                User_id: userId
            }
            await models.merchantGroup.create(body)
        }
        res.status(200).send(
            {
                message: "Success"
            }
        )
    }
    catch {
        (err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating merchants.',
            });
        }
    }
}
exports.forfeitMerchant = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const id = req.params.id;
    models.merchantGroup
        .destroy({
            where: {
                merchantId: id
            },
        })
        .then((num) => {
            if (num === 1) {
                res.send({ message: 'merchants was deleted successfully!' });
            } else {
                res.send({
                    message: `Cannot delete merchants with id=${id}. Maybe merchants was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while Deleting merchants.',
            });
        });
};

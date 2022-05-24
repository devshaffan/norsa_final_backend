const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const sequelize = require('sequelize');

exports.updateMerchantCreditUsed = async (merchantId, amount) => {
    await models.merchants.update({
        creditUsed: sequelize.literal(`creditUsed`) ?
            sequelize.literal(`creditUsed + ${amount} `) : sequelize.literal(`0 + ${amount} `)
    }, {
        where: {
            id: merchantId
        }
    }
    )
}
exports.resetMerchantCreditUsed = async () => {
    await models.merchants.update({
        creditUsed: 0
    })
}
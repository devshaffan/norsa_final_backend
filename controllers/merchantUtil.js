const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const sequelize = require('sequelize');

exports.updateMerchantCreditUsed = async (merchantId, amount) => {
    // await models.merchants.update({
    //     creditUsed: sequelize.literal(`creditUsed`) ?
    //         sequelize.literal(`creditUsed + ${amount} `) : sequelize.literal(`0 + ${amount} `)
    // }, {
    //     where: {
    //         id: merchantId
    //     }
    // }
    // )
    await models.sequelize.query(
        `UPDATE merchants m
        SET m.creditUsed = ifNull(m.creditUsed,0) + ${amount}
        WHERE m.id = '${merchantId}'`, {
        type: models.sequelize.QueryTypes.UPDATE
    })
}
exports.resetMerchantCreditUsed = async () => {
    await models.sequelize.query(
        `UPDATE merchants m
        SET m.creditUsed = 0}
       `, {
        type: models.sequelize.QueryTypes.UPDATE
    })
}
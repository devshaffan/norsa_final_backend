
const cron = require('node-cron');
const { resetMerchantCreditUsed } = require('../controllers/merchantUtil');

const models = require('../models/index');
const getMaxCredit = async (Client_id) => {
    const data = await models.client.findOne({
        where: {
            id: Client_id
        }
    })
    return data.MaxBorrowAmount
}
const createIssuance = async (item) => {
    const MaxBorrowAmount = await getMaxCredit(item.Client_id)
    item.Balance = MaxBorrowAmount
    item.Amount = MaxBorrowAmount
    const inserted = await models.issuancehistory.create(item)
    return inserted
}
const createPayback = async (item) => {
    const data = {}
    data.amount = 0
    data.date = new Date(date.setMonth(date.getMonth() + 1));
    data.issuanceHistory_Id = item.id
    const inserted = await models.paybackPeriod.create(data)
    return inserted
}

module.exports = cron.schedule('0 0 1 * *', async function () {
    //console.log("HIHIIHIIHIHIHIHIIHIHIHIHIHIHIHIHH")
    const data = await models.issuancehistory.findAll()
    for (var i = 0; i < data.length; i++) {
        await models.issuancehistory.update({
            Balance: 0,
        }, {
            where: {
                id: data[i].id
            }
        })
    }
    const response = await models.sequelize.query(`SELECT i.* FROM issuancehistory i GROUP BY i.Client_id `, { type: models.sequelize.QueryTypes.SELECT })
    for (let i = 0; i < response.length; i++) {
        const issuanceResponse = await createIssuance(response[i])
        const paybackResponse = await createPayback(response[i])
    }
    await resetMerchantCreditUsed()
});

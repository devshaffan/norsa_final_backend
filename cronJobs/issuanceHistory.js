
const cron = require('node-cron');
const uuidV4 = require('uuid/v4');
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
    item.id = uuidV4()
    const inserted = await models.issuancehistory.create(item)
    console.log(inserted)
    return inserted
}
const createPayback = async (item) => {
    const data = {}
    data.id = uuidV4()
    data.amount = 0
    var now = new Date();
    if (now.getMonth() == 11) {
        data.date = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        data.date = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    data.issuanceHistory_Id = item.id
    const inserted = await models.paybackPeriod.create(data)
    return inserted
}

module.exports = cron.schedule('0 0 1 * *', async function () {
    //console.log("HIHIIHIIHIHIHIHIIHIHIHIHIHIHIHIHH")
    console.log("started")
    await models.sequelize.query(
        `UPDATE issuancehistory i
        SET i.Balance = 0
        `, {
        type: models.sequelize.QueryTypes.UPDATE
    })

    const response = await models.sequelize.query(`SELECT i.* FROM issuancehistory i GROUP BY i.Client_id `, { type: models.sequelize.QueryTypes.SELECT })
    // console.log(response)
    for (let i = 0; i < response.length; i++) {
        console.log(i)
        const issuanceResponse = await createIssuance(response[i])
        const paybackResponse = await createPayback(response[i])
    }

    await resetMerchantCreditUsed()
    console.log("finished")
});

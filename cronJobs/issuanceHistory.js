
const cron = require('node-cron')

const models = require('../models/index');
const getMaxCredit = async (Client_id) => {
    const data = await models.client.findOne({
        where: {
            id: Client_id
        }
    })
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    console.log(data.MaxBorrowAmount)
    return parseFloat(data.MaxBorrowAmount)
}
const createIssuance = async (item) => {
    const MaxBorrowAmount = 19
    // ygetMaxCredit(item.Client_id)
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

module.exports = cron.schedule('0 0 1 * *', function () {
    //console.log("HIHIIHIIHIHIHIHIIHIHIHIHIHIHIHIHH")
    models.issuancehistory
        .findAll()
        .then((data) => {
            //console.log(data)
            data.map((item, index) => {
                models.issuancehistory.update({
                    Balance: 0,
                }, {
                    where: {
                        id: item.id
                    }
                }).then(  (data) => {
                    // models.sequelize.query(`SELECT i.* FROM issuancehistory i GROUP BY i.Client_id `, { type: models.sequelize.QueryTypes.SELECT }).then(response => {
                        
                    //     response.map(async (item) => {
                    //         const issuanceResponse = await createIssuance(item)
                    //         const paybackResponse = await createPayback(item)
                    //         console.log(issuanceResponse.map(item => item.Balance))
                    //         console.log(paybackResponse.map(item => item.date))
                    //     })
                    // })
                })
                    .catch(err => {
                        //console.log(err)
                    })
            })
        }).catch(err => {
            //console.log("hehe phat gaya ")
        })
});


const cron = require('node-cron')

const models = require('../models/index');
const getMaxCredit = async (Client_id) => {
    const data = await models.client.findOne({
        where: {
            id: Client_id
        }
    })
    return data.MaxBorrowAmount
}
const insert = async (item) => {
    const MaxBorrowAmount = getMaxCredit(item.Client_id)
    item.Balance = MaxBorrowAmount
    item.Amount = MaxBorrowAmount
    const inserted = await models.issuancehistory.create(item)
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
                }).then(data => {
                    // models.sequelize.query(`SELECT * FROM issuancehistory i GROUP BY i.Cliend_id `, { type: models.sequelize.QueryTypes.SELECT }).then(response => {
                    //     response.map(async (item) => {
                    //         const insertedData = await insert(item)
                    //         console.log(insertedData.map(item => item.Balance))
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

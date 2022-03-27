const models = require('../models/index');
const _ = require('lodash');

// exports.topThreeMerchantsByTransaction = (req, res) => {
//     const token = _.get(req.headers, 'authorization', null).split(' ')[1]
//     models.sequelize.query(`SELECT tm.Name, CONCAT(HOUR(tt.dateTime), ':',MINUTE(tt.dateTime))  
//     AS 'Time', SUM(tt.AmountUser) AS 'Amount'
//     FROM transactionhistory tt
//     JOIN (
//     SELECT m.id
//     FROM transactionhistory t 
//     JOIN merchants m ON m.id = t.Merchant_ID
//     GROUP BY t.Merchant_ID
//     ORDER BY SUM(t.AmountUser) DESC
//     LIMIT 3) a ON a.id = tt.Merchant_ID
//     JOIN merchants tm ON tm.id = tt.Merchant_ID
//     group BY HOUR(tt.dateTime), tm.Name
//     ORDER BY tt.Merchant_ID
//     `
//         , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
//             data.map((item, index) => {

//             })
//             return res.json(data)
//         }).catch(err => {
//             res.status(500).send({ error: err })
//         })
// }

exports.topThreeMerchantsByTransaction = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    models.sequelize.query(`
    SELECT m.id
    FROM transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    GROUP BY t.Merchant_ID
    ORDER BY SUM(t.AmountUser) DESC
    LIMIT 3
    `
        , { type: models.sequelize.QueryTypes.SELECT }).then(async data => {
            const finalData = await Promise.all(data.map(async (item, index) => {
                const merchant = {}
                const merchantData = await getMerchantData(item.id)
                merchant.id = item.id
                merchant.data = merchantData
                return merchant
            }))
            return res.json(finalData)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}
const getMerchantData = async (id) => {
    const data = await models.sequelize.query(`
    SELECT tm.Name, CONCAT(HOUR(tt.dateTime), ':',MINUTE(tt.dateTime))  
    AS 'Time', SUM(tt.AmountUser) AS 'Amount'
    FROM transactionhistory tt
    JOIN merchants tm ON tm.id = tt.Merchant_ID
    WHERE tt.Merchant_ID = '${id}'
    group BY HOUR(tt.dateTime), tm.Name
    `, { type: models.sequelize.QueryTypes.SELECT })
    console.log(data)
    return data
}
exports.monthlyTotalProfit = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    models.sequelize.query(`SELECT DATE_FORMAT(p.dateDeposit, '%b') AS 'Month',
    SUM((p.amountPaidByClient/100 * (md.Interest)) - (p.amountPaidByClient/100 * (md.Interest))*0.06) AS 'Profit'
    FROM paybackperiods p
    JOIN issuancehistory h ON h.id = p.issuanceHistory_Id
    JOIN transactionhistory t ON t.issuancehistoryId = p.issuanceHistory_Id
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    JOIN merchanttypediscount md ON md.id = mi.numberOfMonthsId
    WHERE YEAR(p.dateDeposit) = YEAR(NOW())
    GROUP BY MONTH(p.dateDeposit)`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}

exports.currentDateTransaction = (req, res) => {
    models.sequelize.query(`SELECT SUM(t.AmountUser) AS "TodayTransaction"
    FROM transactionhistory t
    WHERE DATE(t.dateTime) = DATE(NOW())`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}

exports.paidByClientToday = (req, res) => {
    models.sequelize.query(`SELECT SUM(p.amountPaidByClient) AS "AmountPaidByClient"
    FROM paybackperiods p
    WHERE DATE(p.dateDeposit) = DATE(NOW())`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}

exports.todaysTotalProfit = (req, res) => {
    models.sequelize.query(`SELECT 
    SUM((p.amountPaidByClient/100 * (md.Interest)) - (p.amountPaidByClient/100 * (md.Interest))*0.06) AS "profit"
    FROM paybackperiods p
    JOIN issuancehistory h ON h.id = p.issuanceHistory_Id
    JOIN transactionhistory t ON t.issuancehistoryId = p.issuanceHistory_Id
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    JOIN merchanttypediscount md ON md.id = mi.numberOfMonthsId
    WHERE DATE(p.dateDeposit) = DATE(NOW())
    GROUP BY DATE(p.dateDeposit)`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}








//WHERE DATE(t.dateTime) = DATE(NOW())

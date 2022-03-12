const models = require('../models/index');
const _ = require('lodash');

exports.topThreeMerchantsByTransaction = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    models.sequelize.query(`SELECT m.Name, SUM(t.AmountUser) AS Amount, TIME(t.dateTime) AS Time
    FROM transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    GROUP BY t.Merchant_ID
    ORDER BY Amount DESC
    LIMIT 3`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
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
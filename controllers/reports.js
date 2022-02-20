const models = require('../models/index');
const _ = require('lodash');

exports.merchantReport = (req, res) => {
    const date = req.params.date
    models.sequelize.query(`SELECT m.Code, m.Name,
    SUM(t.AmountUser) AS 'Total Amount',
    CASE
    WHEN mt.interestOn = 'Client' THEN SUM(t.AmountUser)
    ELSE SUM(t.AmountUser) - (SUM(t.AmountUser)/100 * (d.Interest))
    END AS 'Merchant Incentive',
    d.Interest AS 'Percentage %',
    CASE
    WHEN mt.interestOn = 'Client' THEN 0
    ELSE SUM(t.AmountUser)/100 * (d.Interest)
    END AS 'Norsa Profit',
    CASE
    WHEN mt.interestOn = 'Client' THEN 0
    ELSE SUM(t.AmountUser)/100 * (d.Interest) * 0.06
    END AS 'Tax On Norsa',
    m.BankName AS 'Bank Name', m.AccountNo AS 'Account No'
    FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN issuancehistory i ON i.id = t.issuancehistoryId
    JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    JOIN merchanttypediscount d ON d.id = mi.numberOfMonthsId
    group BY t.Merchant_ID`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}

exports.transactionReport = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    models.sequelize.query(`SELECT t.* from transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN users u ON u.id=m.User_id
    WHERE u.accessToken='${token}' AND Date(t.dateTime) = CURDATE()
    group BY t.Merchant_ID`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}

exports.totalSales = (req, res) => {
    const users = req.params.users;
    models.sequelize.query(`SELECT Date(p.dateDeposit) AS Fetcha, u.email AS  Nomber, MONTH(p.date) AS Period,
        (CAST(p.amountPaidByClient AS float) - CAST(p.amountPaidToDealer AS float)) As Montante, p.remarks AS Remarks FROM paybackperiods p
        JOIN users u ON u.id=p.handledByUserId
        WHERE p.dateDeposit IS NOT NULL 
            AND p.amountPaidByClient IS NOT NULL 
            AND p.amountPaidToDealer IS NOT NULL 
            AND u.id = '${users}'
            AND Date(p.date) = CURDATE()
    `, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}

exports.totalSalesOfCurrentUser = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    models.sequelize.query(`SELECT Date(p.dateDeposit) AS Fetcha, u.email AS  Nomber, MONTH(p.date) AS Period,
    (CAST(p.amountPaidByClient AS float) - CAST(p.amountPaidToDealer AS float)) As Montante, p.remarks AS Remarks FROM paybackperiods p
    JOIN users u ON u.id=p.handledByUserId
    WHERE p.dateDeposit IS NOT NULL 
        AND p.amountPaidByClient IS NOT NULL 
        AND p.amountPaidToDealer IS NOT NULL 
        AND u.accessToken = '${token}'
        AND Date(p.date) = CURDATE()
`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}

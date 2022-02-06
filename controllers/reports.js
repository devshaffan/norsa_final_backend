const models = require('../models/index');

exports.merchantReport = (req, res) => {
    const date = req.params.date
    models.sequelize.query(`SELECT i.DateTime AS 'Fetcha', i.Amount AS 'Montante',
    CASE 
    WHEN mt.interestOn = 'Merchant' THEN SUM(t.AmountUser)
    ELSE SUM(t.AmountUser) + (SUM(t.AmountUser)*mtd.Interest/100)
    END AS 'ClientAmountDue',
    SUM(t.AmountUser) AS 'MontantePaid', SUM(t.AmountUser)*mtd.Interest/100 AS 'ProfileForNorsa',
    SUM(t.AmountUser)*mtd.Interest/100*0.06 AS 'ProfitAfterTax',
    CASE
    WHEN mt.interestOn = 'Merchant' THEN SUM(t.AmountUser) - (SUM(t.AmountUser)*mtd.Interest/100)
    ELSE 
    SUM(t.AmountUser)
    END AS 'PayingAmountToMerchant',
    mt.interestOn
    FROM issuancehistory i
    JOIN transactionhistory t ON t.issuancehistoryId = i.id
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN merchanttypediscount mtd ON mt.id = m.MerchantType_id
    WHERE MONTH('${date}') = MONTH(i.DateTime)  AND YEAR('${date}') = YEAR(i.DateTime)
    Group By i.id
    `, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}
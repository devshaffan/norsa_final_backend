const models = require('../models/index');

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
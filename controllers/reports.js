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
    WHERE Month(DATE(t.dateTime)) = Month('${date}')
    group BY t.Merchant_ID`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}
exports.transactionReport = (req, res) => {
    const merchants = req.params.merchants
    const date = req.params.date
    if (!merchants) {
        res.status(500).send({ message: "no merchants selected " })
        return
    }
    models.sequelize.query(`SELECT m.Name, t.* from transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    WHERE m.id IN (:merchants) AND Date(t.dateTime) = '${date}'
    group BY t.Merchant_ID
    order by m.Name
    `
        , {
            replacements: { merchants: merchants.split(',') },
            type: models.sequelize.QueryTypes.SELECT
        }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}
exports.totalSales = (req, res) => {
    const users = req.params.users;
    const date = req.params.date;
    if (!users || !date) {
        res.status(500).send({ message: "no user selected or date" })
        return
    }
    models.sequelize.query(`
    SELECT i.Client_id AS 'Code', CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', u.email, p.amount, p.dateDeposit, i.TypeOfReturnPayment
    FROM paybackperiods p
    JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
    JOIN client c ON c.id = i.Client_id 
    JOIN users u ON u.id = p.handledByUserId
    WHERE u.id IN (:users) AND  Date(p.DateDeposit) = '${date}'
    ORDER BY p.dateDeposit, u.email;
    `, {
        replacements: {
            users: users.split(',')
        },
        type: models.sequelize.QueryTypes.SELECT
    }).then(data => {
        console.log(data)
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}
exports.totalSalesOfCurrentUser = (req, res) => {
    const token = _.get(req.headers, 'authorization', null).split(' ')[1]
    const date = req.params.date
    if (!date) {
        res.status(500).send({ message: "no user selected or date" })
        return
    }
    models.sequelize.query(`SELECT i.Client_id AS 'Code', CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', u.email, p.amount, p.dateDeposit, i.TypeOfReturnPayment
    FROM paybackperiods p
    JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
    JOIN client c ON c.id = i.Client_id
    JOIN users u ON u.id = p.handledByUserId
    WHERE u.accessToken = '${token}' AND  Date(p.DateDeposit) = '${date}'
    ORDER BY p.dateDeposit, u.email;
`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}
exports.dealerReport = (req, res) => {
    const dealers = req.params.dealers
    const month = req.params.month.split("-")[1]
    if (!dealers) {
        res.status(500).send({ message: "no dealer selected" })
    }
    models.sequelize.query(`SELECT c.Code AS 'Code', c.Dealer_id AS 'Dealer',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', p.Date AS 'Date',
    SUM(p.amount) AS 'Paybackperiod_Amount', SUM(m.amount) AS 'Membership_Fee', (IFNULL(p.amount,0) + IFNULL(m.amount,0) + IFNULL(i.amount,0)) AS 'Total_Sum'
    FROM client c
    LEFT JOIN memberships m ON m.clientFk=c.id
    LEFT JOIN issuancehistory ih ON ih.Client_id=c.id
    LEFT JOIN insurances i ON i.issuanceHistoryFk=ih.id
    LEFT JOIN paybackperiods p ON p.issuanceHistory_Id=ih.id
    WHERE c.Dealer_id IN (:dealers) AND MONTH(c.Date) = '${month}'
	group BY c.id,c.Dealer_id 
    Order by c.Dealer_id`, {
        replacements: { dealers: dealers.split(',') },
        type: models.sequelize.QueryTypes.SELECT
    })
        .then(data => {
            return res.json(data)
        })
        .catch(err => {
            res.status(500).send({ err })
        })
}

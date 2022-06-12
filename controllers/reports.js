const models = require('../models/index');
const _ = require('lodash');
exports.merchantReport = (req, res) => {
    const month = req.params.date.split("-")[1]
    // CASE
    // WHEN mt.interestOn = 'Client' THEN 0
    // ELSE Cast((SUM(t.AmountUser) / 100 * (d.Interest)) AS
    //  DECIMAL(10, 2))
    // END AS 'Norsa Profit',
    models.sequelize.query(`SELECT m.Code AS "Merchant Code", m.Name AS "Merchant Name",
    FORMAT(SUM(t.AmountUser),2) AS 'Total Amount',
    CASE
    WHEN mt.interestOn = 'Client' THEN SUM(t.AmountUser)
    ELSE CAST((SUM(t.AmountUser) - (SUM(t.AmountUser)/100 * (d.Interest))) AS DECIMAL(10,2))
    END AS 'Sum Of Final Amount (Exculding Tax and Norsa Profit)',
    d.Interest AS 'Percentage %',
    CASE
    WHEN mt.interestOn = 'Client' THEN 0
    ELSE Cast((SUM(t.AmountUser)/100 * (d.Interest) * 0.06) AS
     DECIMAL(10,2))
    END AS 'OB(TAX)',
    m.BankName AS 'Bank Name', m.AccountNo AS 'Bank Account'
    FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN issuancehistory i ON i.id = t.issuancehistoryId
    JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    JOIN merchanttypediscount d ON d.id = mi.numberOfMonthsId
    WHERE Month(DATE(t.dateTime)) = '${month}'
    group BY t.Merchant_ID`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}
exports.supermarketReport = (req, res) => {
    const month = req.params.date.split("-")[1]
    // CASE
    // WHEN mt.interestOn = 'Client' THEN 0
    // ELSE Cast((SUM(t.AmountUser) / 100 * (d.Interest)) AS
    //  DECIMAL(10, 2))
    // END AS 'Norsa Profit',
    models.sequelize.query(`SELECT m.Code AS "Merchant Code", m.Name AS "Merchant Name",
    FORMAT(SUM(t.AmountUser),2) AS 'Total Amount',
    CASE
    WHEN mt.interestOn = 'Client' THEN SUM(t.AmountUser)
    ELSE CAST((SUM(t.AmountUser) - (SUM(t.AmountUser)/100 * (d.Interest))) AS DECIMAL(10,2))
    END AS 'Sum Of Final Amount (Exculding Tax and Norsa Profit)',
    d.Interest AS 'Percentage %',
    CASE
    WHEN mt.interestOn = 'Client' THEN 0
    ELSE Cast((SUM(t.AmountUser)/100 * (d.Interest) * 0.06) AS
     DECIMAL(10,2))
    END AS 'OB(TAX)',
    m.BankName AS 'Bank Name', m.AccountNo AS 'Bank Account'
    FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN issuancehistory i ON i.id = t.issuancehistoryId
    JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    JOIN merchanttypediscount d ON d.id = mi.numberOfMonthsId
    WHERE Month(DATE(t.dateTime)) = '${month}' AND mt.Title = 'Supermarket'
    group BY t.Merchant_ID`
        , { type: models.sequelize.QueryTypes.SELECT }).then(data => {
            return res.json(data)
        }).catch(err => {
            res.status(500).send({ error: err })
        })
}
exports.transactionReport = (req, res) => {
    const merchants = req.params.merchants
    const dateFrom = req.params.dateFrom
    const dateTo = req.params.dateTo
    console.log('jhkjhkjhkjhkjhkjhkjhkjhkjhkjhkjhkj')
    console.log(dateFrom)

    if (!merchants) {
        res.status(500).send({ message: "no merchants selected " })
        return
    }
    models.sequelize.query(`SELECT m.Name AS 'Merchant_Name',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Client_Name', CAST(t.AmountUser AS decimal(10,2)) AS 'Amount',
    t.dateTime AS 'Date',t.ItemDescription AS 'Item_Description' from transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN client c ON c.id = t.Client_id
    WHERE m.id IN (:merchants) AND (DATE(t.dateTime) > '${dateFrom}' AND DATE(t.dateTime) < '${dateTo}')
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
    SELECT p.dateDeposit, i.Client_id, CONCAT(c.FirstName, c.LastName) AS 'Nomber', u.email AS 'Email', FORMAT(p.amountPaidByClient,2),
    p.TypeOfReturnPayment, FORMAT((p.amountPaidToDealer* (-1)),2) AS 'Dealer Comission', FORMAT(mm.memberSum,2) AS 'Membership', FORMAT(ins.amount,2) AS 'Insurance'
    FROM paybackperiods p
    JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
    JOIN client c ON c.id = i.Client_id
    JOIN users u ON u.id = p.handledByUserId
    LEFT JOIN (
    SELECT m.clientFk, SUM(m.amount) AS 'memberSum'
    FROM memberships m
    WHERE m.month = '${date}'
    group BY m.clientFk) mm ON mm.clientFk = i.Client_id
    LEFT JOIN (
    SELECT ins.amount, ins.issuanceHistoryFk
    FROM insurances ins
    WHERE DATE(ins.createdAt) = '${date}') ins ON ins.issuanceHistoryFk = i.id
    WHERE DATE(p.dateDeposit) = '${date}'
    AND p.handledByUserId IN (:users)
    UNION
    SELECT '', '', '', '', '', '', '', '', ''
    UNION
    SELECT '', '', '', '', '', '', '', 'Total', (
    SELECT IFNULL(FORMAT(SUM(IFNULL(pp.amountPaidByClient, 0) - IFNULL(pp.amountPaidToDealer, 0) + IFNULL(mmmm.memberSum, 0) + IFNULL(inss.amount, 0)), 2), 0) AS 'Total'
    FROM paybackperiods pp
    JOIN issuancehistory ii ON ii.id = pp.issuanceHistory_Id
    JOIN client cc ON cc.id = ii.Client_id
    LEFT JOIN (
    SELECT mmm.clientFk, SUM(mmm.amount) AS 'memberSum'
    FROM memberships mmm
    WHERE mmm.month = '${date}'
    group BY mmm.clientFk) mmmm ON mmmm.clientFk = ii.Client_id
    LEFT JOIN (
    SELECT insuu.amount, insuu.issuanceHistoryFk
    FROM insurances insuu
    WHERE DATE(insuu.createdAt) = '${date}') inss ON inss.issuanceHistoryFk = ii.id
    WHERE DATE(pp.dateDeposit) = '${date}'
        ) 
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
    models.sequelize.query(` 
    SELECT p.dateDeposit, i.Client_id, CONCAT(c.FirstName, c.LastName) AS 'Nomber', u.email AS 'Email', FORMAT(p.amountPaidByClient,2),
    p.TypeOfReturnPayment, FORMAT((p.amountPaidToDealer* (-1)),2) AS 'Dealer Comission', FORMAT(mm.memberSum,2) AS 'Membership', FORMAT(ins.amount,2) AS 'Insurance'
    FROM paybackperiods p
    JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
    JOIN client c ON c.id = i.Client_id
    JOIN users u ON u.id = p.handledByUserId
    LEFT JOIN (
    SELECT m.clientFk, SUM(m.amount) AS 'memberSum'
    FROM memberships m
    WHERE m.month = '${date}'
    group BY m.clientFk) mm ON mm.clientFk = i.Client_id
    LEFT JOIN (
    SELECT ins.amount, ins.issuanceHistoryFk
    FROM insurances ins
    WHERE DATE(ins.createdAt) = '${date}') ins ON ins.issuanceHistoryFk = i.id
    WHERE DATE(p.dateDeposit) = '${date}'
    AND u.accessToken = '${token}'
    UNION
    SELECT '', '', '', '', '', '', '', '', ''
    UNION
    SELECT '', '', '', '', '', '', '', 'Total', (
    SELECT IFNULL(FORMAT(SUM(IFNULL(pp.amountPaidByClient, 0) - IFNULL(pp.amountPaidToDealer, 0) + IFNULL(mmmm.memberSum, 0) + IFNULL(inss.amount, 0)), 2), 0) AS 'Total'
    FROM paybackperiods pp
    JOIN issuancehistory ii ON ii.id = pp.issuanceHistory_Id
    JOIN client cc ON cc.id = ii.Client_id
    LEFT JOIN (
    SELECT mmm.clientFk, SUM(mmm.amount) AS 'memberSum'
    FROM memberships mmm
    WHERE mmm.month = '${date}'
    group BY mmm.clientFk) mmmm ON mmmm.clientFk = ii.Client_id
    LEFT JOIN (
    SELECT insuu.amount, insuu.issuanceHistoryFk
    FROM insurances insuu
    WHERE DATE(insuu.createdAt) = '${date}') inss ON inss.issuanceHistoryFk = ii.id
    WHERE DATE(pp.dateDeposit) = '${date}'
        ) 
`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}
exports.dealerReport = (req, res) => {
    if (!req.params.dealers || !req.params.month) {
        res.status(500).send({ err: "either no dealer or no date is selected" })
        return
    }
    const dealers = req.params.dealers.split(",")
    const month = req.params.month.split("-")[1]
    //CAST(SUM(p.amount) AS DECIMAL(10,2)) AS 'Paybackperiod_Amount', m.amount AS 'Membership_Fee',
    models.sequelize.query(`SELECT  c.Dealer_id AS 'Dealer', c.Code AS 'Code',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Nomber', p.Date AS 'FECHA',
    CAST((IFNULL(p.amount,0) + IFNULL(m.amount,0) + IFNULL(i.amount,0)) AS DECIMAL(10,2)) AS 'SUB TOTAL',
    0 AS 'ADM KSTN',
    (CAST((IFNULL(p.amount,0) + IFNULL(m.amount,0) + IFNULL(i.amount,0)) AS DECIMAL(10,2)) + 0) AS 'TOTAL'
    FROM client c
    LEFT JOIN memberships m ON m.clientFk=c.id
    LEFT JOIN issuancehistory ih ON ih.Client_id=c.id
    LEFT JOIN insurances i ON i.issuanceHistoryFk=ih.id
    LEFT JOIN paybackperiods p ON p.issuanceHistory_Id=ih.id
    WHERE (c.Dealer_id IN (:dealers)) AND MONTH(c.Date) = '${month}'
	group BY c.id,c.Dealer_id 
    Order by c.Dealer_id`, {
        replacements: { dealers: dealers },
        type: models.sequelize.QueryTypes.SELECT
    })
        .then(data => {
            return res.json(data)
        })
        .catch(err => {
            res.status(500).send({ err })
        })
}

exports.insuranceReport = (req, res) => {
    if (!req.params.clients || !req.params.month) {
        res.status(500).send({ err: "either no dealer or no date is selected" })
        return
    }
    const month = req.params.month.split("-")[1]
    const clients = req.params.clients.split(",")
    models.sequelize.query(`SELECT c.Code AS 'Code',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', 
    SUM(i.amount) AS 'insuranceAmount' 
    FROM client c
    JOIN issuancehistory ih ON ih.Client_id=c.id
    JOIN insurances i ON i.issuanceHistoryFk=ih.id
    WHERE (c.id IN (:clients)) AND MONTH(c.Date) = '${month}'
	group BY c.id 
    Order by c.id`, {
        replacements: { clients: clients },
        type: models.sequelize.QueryTypes.SELECT
    })
        .then(data => {
            return res.json(data)
        })
        .catch(err => {
            res.status(500).send({ err })
        })
}

exports.membershipFeeReport = (req, res) => {
    if (!req.params.clients) {
        res.status(500).send({ err: "either no dealer or no date is selected" })
        return
    }
    const clients = req.params.clients.split(",")
    models.sequelize.query(`SELECT c.Code AS 'Code',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', 
    mm.sum AS 'Membership_Amount'
    FROM client c
    left JOIN (
	 SELECT SUM(m.amount) AS SUM, m.clientFk
	 FROM memberships m 
	 WHERE YEAR(m.month) = YEAR(NOW())
	 group BY m.clientFk) mm ON mm.clientFk = c.id
    JOIN issuancehistory ih ON ih.Client_id=c.id
    JOIN paybackperiods p ON p.issuanceHistory_Id=ih.id
    WHERE (c.id IN (:clients))
	group BY c.id 
    Order by c.id`, {
        replacements: { clients: clients },
        type: models.sequelize.QueryTypes.SELECT
    })
        .then(data => {
            return res.json(data)
        })
        .catch(err => {
            res.status(500).send({ err })
        })
}

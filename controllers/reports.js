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
    FORMAT(SUM(t.AmountUser) - IFNULL(ttt.Retour,0),2) AS 'Total Amount',
    CASE
    WHEN mt.interestOn = 'Client' THEN FORMAT(SUM(t.AmountUser) - IFNULL(ttt.Retour,0),2)
    ELSE FORMAT((SUM(t.AmountUser) - IFNULL(ttt.Retour,0)- (SUM(t.AmountUser)/100 * (d.Interest))),2)
    END AS 'Sum Of Final Amount (Exculding Tax and Norsa Profit)',
    d.Interest AS 'Percentage %',
    CASE
    WHEN mt.interestOn = 'Client' THEN 0
    ELSE FORMAT((SUM(t.AmountUser)/100 * (d.Interest) * 0.06) ,2)
    END AS 'OB(TAX)',
    m.BankName AS 'Bank Name', m.AccountNo AS 'Bank Account'
    FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN issuancehistory i ON i.id = t.issuancehistoryId
    LEFT JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    LEFT JOIN merchanttypediscount d ON d.id = mi.numberOfMonthsId
    LEFT JOIN (SELECT SUM(tt.AmountUser) AS 'Retour', tt.Merchant_ID FROM transactionhistory tt WHERE tt.transactionType = 2 group BY tt.Merchant_ID)  ttt ON ttt.Merchant_ID = t.Merchant_ID
  	WHERE Month(DATE(t.dateTime)) = '${month}'  AND mt.interestOn = 'Merchant' AND t.transactionType = 1
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
    FORMAT(SUM(t.AmountUser) - IFNULL(ttt.Retour,0),2) AS 'Total Amount',
    m.BankName AS 'Bank Name', m.AccountNo AS 'Bank Account'
    FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN merchanttype mt ON mt.id = m.MerchantType_id
    JOIN issuancehistory i ON i.id = t.issuancehistoryId
    LEFT JOIN multipleissueances mi ON (mi.merchantId = t.Merchant_ID AND mi.issuancehistoryId = t.issuancehistoryId)
    LEFT JOIN merchanttypediscount d ON d.id = mi.numberOfMonthsId
    LEFT JOIN (SELECT SUM(tt.AmountUser) AS 'Retour', tt.Merchant_ID FROM transactionhistory tt WHERE tt.transactionType = 2 group BY tt.Merchant_ID)  ttt ON ttt.Merchant_ID = t.Merchant_ID
  	 WHERE Month(DATE(t.dateTime)) = '${month}' AND mt.interestOn = 'Client' AND t.transactionType = 1
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
    models.sequelize.query(`SELECT m.Name AS 'Merchant_Name',c.Code AS 'Nomber',
    CONCAT(c.FirstName, ' ', c.LastName) AS 'Client_Name', CAST(t.AmountUser AS decimal(10,2)) AS 'Amount',
    CONCAT(DATE(t.dateTime),' : ',TIME(t.dateTime)) AS 'Date',
    t.ItemDescription AS 'Item_Description' from transactionhistory t 
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN client c ON c.id = t.Client_id
    WHERE m.id IN (:merchants) AND (DATE(t.dateTime) >= '${dateFrom}' AND DATE(t.dateTime) <= '${dateTo}')
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
    SELECT p.dateDeposit as 'Date Deposit', i.Client_id as 'Client', CONCAT(c.FirstName, c.LastName) AS 'Nomber', u.email AS 'Email', FORMAT(p.amountPaidByClient,2) as 'Amount Paid By Client',
    p.TypeOfReturnPayment as 'Type of Payment', FORMAT((p.amountPaidToDealer* (-1)),2) AS 'Dealer Comission', FORMAT(mm.memberSum,2) AS 'Membership', FORMAT(ins.amount,2) AS 'Insurance'
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
    JOIN users uu ON uu.id = pp.handledByUserId
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
    AND pp.handledByUserId IN (:users) AND pp.TypeOfReturnPayment = 'Cash'
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
    SELECT p.dateDeposit as 'Date Deposit', i.Client_id as 'Client', CONCAT(c.FirstName, c.LastName) AS 'Nomber', u.email AS 'Email', FORMAT(p.amountPaidByClient,2) as 'Amount Paid by Client',
    p.TypeOfReturnPayment as 'Type of Payment', FORMAT((p.amountPaidToDealer* (-1)),2) AS 'Dealer Comission', FORMAT(mm.memberSum,2) AS 'Membership', FORMAT(ins.amount,2) AS 'Insurance'
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
    JOIN users uu ON uu.id = pp.handledByUserId
    LEFT JOIN (
    SELECT mmm.clientFk, SUM(mmm.amount) AS 'memberSum'
    FROM memberships mmm
    WHERE mmm.month = '${date}'
    group BY mmm.clientFk) mmmm ON mmmm.clientFk = ii.Client_id
    LEFT JOIN (
    SELECT insuu.amount, insuu.issuanceHistoryFk
    FROM insurances insuu
    WHERE DATE(insuu.createdAt) = '${date}') inss ON inss.issuanceHistoryFk = ii.id
    WHERE DATE(pp.dateDeposit) = '${date}' AND uu.accessToken = '${token}' AND pp.TypeOfReturnPayment = 'Cash'
        ) 
`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
        return res.json(data)
    }).catch(err => {
        res.status(500).send({ error: err })
    })
}
exports.dealerReport = async (req, res) => {
    try {
        if (!req.params.dealers || !req.params.month) {
            res.status(500).send({ err: "either no dealer or no date is selected" })
            return
        }
        const dealers = req.params.dealers.split(",")
        const month = req.params.month.split("-")[1]
        const type = req.params.type
        //CAST(SUM(p.amount) AS DECIMAL(10,2)) AS 'Paybackperiod_Amount', m.amount AS 'Membership_Fee',
        const finalQuery = []
        // const prequery1 = await models.sequelize.query(`
        //     SELECT 'Kuentanan Bankario di Norsa N.V.'
        //     `, { type: models.sequelize.QueryTypes.SELECT })
        // const prequery2 = await models.sequelize.query(`
        //     SELECT 'MCB : 81291304'
        //     `, { type: models.sequelize.QueryTypes.SELECT })
        // const prequery3 = await models.sequelize.query(`
        //     SELECT 'RBC : 8000000013345067'
        //     `, { type: models.sequelize.QueryTypes.SELECT })


        // finalQuery.push(prequery1[0])
        // finalQuery.push({'' : ''})
        // finalQuery.push(prequery2[0])
        // finalQuery.push(prequery3[0])
        // finalQuery.push({'' : ''})
        const data = await models.sequelize.query(`
            SELECT '' AS Dealer,'' AS 'Nomber','' AS 'Name','' AS 'Fecha','' AS 'Type','' AS 'Sub Total','' AS 'ADM KSTN','' AS 'Total'
            UNION ALL
            SELECT 'Kuentanan Bankario di Norsa N.V.','','','','','','',''
            UNION ALL
            SELECT '', '', '', '','', '', '',''
            UNION ALL
            SELECT 'MCB : 81291304', '', '', '','', '', '',''
            UNION ALL
            SELECT 'RBC : 8000000013345067','', '', '','', '', '','' 
            UNION ALL
            SELECT '', '', '', '','', '', '',''
            UNION ALL
            SELECT 'Dealer','Nomber','Name','Fecha','Type','Sub Total','ADM KSTN','Total'
            UNION All
            SELECT c.Dealer_id AS 'Dealer', c.Code AS 'Nomber', CONCAT(c.FirstName, ' ', c.LastName) AS 'Name', Date(p.date) AS 'Fecha',
            CASE
                WHEN
                    '${type}' = 1 THEN 'Interest On Client'
                WHEN
                    '${type}' = 2 THEN 'Interest On Merchant'
                ELSE 
                    p.type
            END AS 'Type',
            FORMAT(p.amount, 2) AS 'Sub Total',
            CASE
                WHEN
                    FORMAT(IFNULL(mm.memberSum, 0), 2) = 0
                THEN '4.2'
                ELSE '0' 
            END AS 'ADM KSTN',
            (
                Format(IFNULL(p.amount, 0),2) + (
                    CASE
                        WHEN
                            FORMAT(IFNULL(mm.memberSum, 0), 2) = 0
                        THEN '4.2'
                        ELSE '0'
                    END )
            ) AS 'Total'
            FROM paybackperiods p
            JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
            JOIN client c ON c.id = i.Client_id
            LEFT JOIN (
                SELECT mem.clientFk, mem.amount AS 'memberSum' FROM memberships mem 
                LEFT JOIN (
                    SELECT m.clientFk, SUM(m.amount) AS 'amount' FROM memberships m
                    WHERE YEAR(m.month) = YEAR(NOW())
                    group BY m.clientFk
                    HAVING SUM(m.amount) >= 50
                ) a ON a.clientFk = mem.clientFk
                WHERE MONTH(mem.month) = '${month}') mm ON mm.clientFk = c.id
            WHERE MONTH(p.date) = '${month}' AND c.Dealer_id IN (:dealers) AND p.amount IS NOT NULL AND p.amount > 0 AND p.type = '${type}'
            UNION ALL
            SELECT '', '', '', '','', '', '',''
            UNION
            SELECT '','', '','', '','','Total', Format((
            SELECT SUM( (IFNULL(p.amount, 0) + (
                CASE
                    WHEN FORMAT(IFNULL(mmm.memberSum, 0), 2) = 0 
                    THEN '4.2'
                    ELSE '0'
                END)
                )
            ) AS 'Total'
            FROM paybackperiods p
            JOIN issuancehistory i ON i.id = p.issuanceHistory_Id
            JOIN client c ON c.id = i.Client_id
            LEFT JOIN (
                SELECT memb.clientFk, memb.amount AS 'memberSum' FROM memberships memb
                LEFT JOIN (
                    SELECT me.clientFk, SUM(me.amount) AS 'amount' FROM memberships me
                    WHERE YEAR(me.month) = YEAR(NOW())
                    group BY me.clientFk
                    HAVING SUM(me.amount) >= 50) a ON a.clientFk = memb.clientFk
                WHERE MONTH(memb.month) = '${month}') mmm ON mmm.clientFk = c.id
            WHERE MONTH(p.date) = '${month}'AND
            c.Dealer_id IN (:dealers) AND
            p.amount IS NOT NULL AND
            p.amount > 0 AND 
            p.type = '${type}'),2)

        `, {
            replacements: { dealers: dealers },
            type: models.sequelize.QueryTypes.SELECT
        })
        data.map(item => {
            finalQuery.push(item)
        })
        return res.send(data)
    }
    catch (err) {
        res.status(500).send({ err })
    }
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

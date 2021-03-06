const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const { Op } = require('sequelize');
const { getCurrentDate } = require('../utils/dateHandler');
const { updateMerchantCreditUsed } = require('./merchantUtil');
exports.getTransactionHistoryById = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.findById(id).then(data => {
        res.json({ message: 'success', data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.getTransactionHistoryByClientId = (req, res) => {
    const Client_id = req.params.id;
    if (!Client_id) {
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.sequelize.query(`SELECT m.Name AS 'Name',t.Client_id As 'Client_id', t.transactionType AS 'transactionType',  t.Amountuser AS 'Amount', DATE(t.dateTime) AS 'Date', TIME(t.dateTime) AS 'Time', count(p.date) AS "PaybackMonths" FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID 
    JOIN issuancehistory i ON i.id = t.issuancehistoryId 
    JOIN paybackperiods p ON p.issuanceHistory_Id = i.id 
    WHERE t.Client_id = "${Client_id}"
    group By t.id
    `,
        { type: models.sequelize.QueryTypes.SELECT }).then((data) => {
            res.json({ message: 'success', data })
        }).catch((err) => {
            res.status(500).send({
                message: 'error', error: err
            });
        });
    // models.transactionhistory.findAll({
    //     where: {
    //         Client_id: Client_id
    //     }
    // }).then(data => {
    //     res.json({ message: 'success', data });
    // }).catch(err => {
    //     res.status(500).send({
    //         message: 'error',
    //         error: err
    //     });
    // });
};
// ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START 
// ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START // ON TRANSACTION FUNCTIONALITY START 
const updatePayback = async (issuancehistory_Id, AmountUser, type, typeOfPaybackPeriod) => {
    let allPaybacks = await models.paybackPeriod.findAll({
        where: {
            issuanceHistory_Id: issuancehistory_Id,
        }
    })
    // filter allPaybacks where typeOfPaybackPeriod == 1
    //allPaybacks[4] ---> allPaybacks[2]
    if (typeOfPaybackPeriod == 1) {
        allPaybacks = allPaybacks.filter(item => item.type == 1)
    }
    else (
        allPaybacks = allPaybacks.filter(item => item.type == 2)
    )
    if (allPaybacks.length == 0) return null
    var eachAmountUser = AmountUser / allPaybacks.length
    if (type == 1) {
        for (var i = 0; i < allPaybacks.length; i++) {
            await models.paybackPeriod.update({ amount: parseFloat(allPaybacks[i].amount) + eachAmountUser }, { where: { id: allPaybacks[i].id } })
        }
    }
    else {
        for (var i = 0; i < allPaybacks.length; i++) {
            await models.paybackPeriod.update({ amount: parseFloat(allPaybacks[i].amount) - eachAmountUser }, { where: { id: allPaybacks[i].id } })
        }
    }
}
const getNumberOfMonthsAndInterest = async (issuancehistoryId, merchantId) => {
    // where mi = multiple issuances
    const miData = await models.multipleIssueances.findOne({
        where: {
            issuancehistoryId: issuancehistoryId,
            merchantId: merchantId
        }
    })
    const merchantData = await models.merchants.findOne({
        where: {
            id: merchantId,
        }
    })
    if (!merchantData) return null // handle this
    let merchanttypediscount;
    if (!miData) {
        merchanttypediscount = await models.merchanttypediscount.findOne({
            where: {
                MerchantType_id: merchantData.MerchantType_id
            }
        })
    }
    else {
        merchanttypediscount = await models.merchanttypediscount.findOne({
            where: {
                id: miData.numberOfMonthsId,
                MerchantType_id: merchantData.MerchantType_id
            }
        })
    }
    if (!merchanttypediscount) return null
    return merchanttypediscount.Interest
}
const getInterestOn = async (Merchant_ID) => {
    const merchantData = await models.merchants.findOne({
        where: {
            id: Merchant_ID,
        }
    })
    if (!merchantData) return null
    const merchantType = await models.merchanttype.findOne({
        where: {
            id: merchantData.MerchantType_id
        }
    })
    if (!merchantType) return null
    return merchantType.interestOn
}

const updateBalance = async (issuancehistoryId, amount, type) => {
    const data = await models.issuancehistory.findOne({ where: { id: issuancehistoryId } })
    if (!data) return null
    if (parseInt(type) == 1)
        await models.issuancehistory.update({ Balance: parseFloat(data.Balance) - amount }, { where: { id: issuancehistoryId } })
    else if (parseInt(type) == 2)
        await models.issuancehistory.update({ Balance: parseFloat(data.Balance) + amount }, { where: { id: issuancehistoryId } })
}

const handleTransactionEntry = async (row) => {
    await updateBalance(row.issuancehistoryId, row.AmountUser, row.transactionType)
    const interestOn = await getInterestOn(row.Merchant_ID)
    if (!interestOn) return null
    var AmountUser = parseFloat(row.AmountUser)
    let typeOfPaybackPeriod = 2              //1 == client, 0 == merchant
    if (interestOn.toLocaleLowerCase() == "client") {
        typeOfPaybackPeriod = 1
        const Interest = await getNumberOfMonthsAndInterest(row.issuancehistoryId, row.Merchant_ID)
        if (!Interest) return null
        AmountUser = AmountUser + AmountUser * parseFloat(Interest) / 100
    }
    await updatePayback(row.issuancehistoryId, AmountUser, parseInt(row.transactionType), typeOfPaybackPeriod)
}


// ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END 
// ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END  

exports.getMerchant_ID = async (token) => {
    const authorizedUser = await models.user.findOne({
        attributes: ['id'],
        where: {
            accessToken: token
        }
    })
    if (!authorizedUser) return null
    const merchant = await models.merchants.findOne({
        attributes: ['id'],
        where: {
            User_id: authorizedUser.id,
        }
    })
    if (!merchant) return null
    return merchant.id
}
exports.getMerchantsTodaysTransactions = async (req, res) => {
    const Merchant_ID = await this.getMerchant_ID(_.get(req.headers, 'authorization', null).split(' ')[1])
    if (!Merchant_ID) {
        res.status(400).send({
            message: 'This User doesnt exist as a merchant'
        });
        return;
    }

    models.sequelize.query(`SELECT m.Name AS 'Name', t.* , COUNT(p.id) AS totalPaybackPeriods FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN paybackperiods p ON p.issuanceHistory_Id = t.issuancehistoryId 
    WHERE (Date(t.dateTime) = CURDATE() AND t.Merchant_ID = '${Merchant_ID}')
    GROUP BY t.id`,
        { type: models.sequelize.QueryTypes.SELECT }).then((data) => {
            res.json({ message: 'success', data })
        }).catch((err) => {
            res.status(500).send({
                message: 'error', error: err
            });
        });
}
const checkMerchantCredit = async (id, newAmount) => {
    const merchantData = await models.merchants.findOne({
        attributes: ['maxCredit', 'creditUsed'],
        where: {
            id: id,
        }
    })
    let { maxCredit, creditUsed } = merchantData
    if (!maxCredit) {
        return false;
    }
    creditUsed = creditUsed || 0
    if (parseFloat(creditUsed) + parseFloat(newAmount) >= parseFloat(maxCredit)) {
        return false;
    }
    return true;
}
exports.createTransactionHistory = async (req, res) => {
    const { Client_id,
        ItemDescription,
        dateTime,
        AmountUser,
        issuancehistoryId,
        transactionType,
    } = req.body;

    const Merchant_ID = await this.getMerchant_ID(_.get(req.headers, 'authorization', null).split(' ')[1])

    if (!Client_id || !ItemDescription || !dateTime || !AmountUser) {
        res.status(400).send({
            message: 'data is required'
        });
    }
    if (!Merchant_ID) {
        res.status(400).send({
            message: 'This User doesnt exist as a merchant'
        });
        return;
    }
    const ifMerchantTransact = await checkMerchantCredit(Merchant_ID,AmountUser)
    if (!ifMerchantTransact) {
        res.status(500).send({
            message: 'Not Sufficient Credit of Merchant'
        });
        return;
    }
    models.transactionhistory.create({
        id: uuidV4(),
        Client_id,
        Merchant_ID,
        ItemDescription,
        dateTime,
        AmountUser,
        issuancehistoryId,
        transactionType
    }).then(async data => {
        try {
            await handleTransactionEntry(data)
            await updateMerchantCreditUsed(Merchant_ID, AmountUser)
            await models.dailysalesprintcheck.update({
                datePrinted: getCurrentDate(),
                status: false
            }, {
                where:
                {
                    merchantId: data.Merchant_ID
                }
            })
            res.status(200).send({ success: true, data: data })
        } catch (error) {
            res.status(500).send({
                message:
                    error.message || 'Some error occurred while creating the dealer.',
            });
        }

    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the dealer.',
            });
        })
    // res.json({ message: 'success', data: data });
}


exports.bulkCreateTransectionHistory = (req, res) => {
    const { Client_id,
        Merchant_ID,
        ItemDescription,
        dateTime,
        AmountUser, issuancehistoryId } = req.body;
    if (!Client_id || !Merchant_ID || !ItemDescription || !dateTime || !AmountUser) {
        res.status(400).send({
            message: 'data is required'
        });
    }
    models.transactionhistory.bulkCreate(req.body).then(data => {
        res.json({ message: 'success', data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.getAllTransactionHistory = (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 1000;
    const offset = req.params.offset !== undefined ? req.params.offset : 0;

    models.transactionhistory.findAll({ limit, offset }).then(data => {
        res.json({ message: 'success', data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};

exports.sumByIssuanceHistoryId = (req, res) => {
    const id = req.params.id

    models.transactionhistory.findAll({
        where: {
            issuancehistoryId: id
        }
    }).then(data => {
        let amount = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].transactionType == 1)
                amount += parseInt(data[i].AmountUser)
            else if (data[i].transactionType == 2)
                amount -= parseInt(data[i].AmountUser)
        }
        res.json({ message: 'success', amount: amount });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};

exports.deleteTransectionById = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.destroy({
        where: {
            id
        }
    }).then(data => {
        res.json({ message: 'success', data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.updateTransection = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).send({
            message: 'id is required'
        });
    }
    models.transactionhistory.update(req.body, {
        where: {
            id
        }
    }).then(data => {
        res.json({ message: 'success', data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
exports.searchTransactions = (req, res) => {
    const limit = req.params.limit !== undefined ? req.params.limit : 10000;
    const offset = req.params.offset !== undefined ? req.params.limit : 0;
    models.sequelize.query(`SELECT t.id id , t.ItemDescription ItemDescription , t.dateTime 'dateTime' , t.AmountUser AmountUser , c.id AS 'client_Id' , c.FirstName FirstName , 
    c.LastName LastName , m.id merchant_Id, m.Name 'Name' , m.Email 'Merchant_Email'
    FROM transactionhistory t
    JOIN client c ON c.id = t.Client_id
    JOIN merchants m ON m.id = t.Merchant_ID
    LIMIT ${limit} OFFSET ${offset} `, { type: models.sequelize.QueryTypes.SELECT })
        .then(data => {
            res.json({ message: 'success', data });
        }).catch(err => {
            res.status(500).send({
                message: 'error',
                error: err
            });
        });
};
exports.getTodaysTransactions = (req, res) => {

    models.sequelize.query(`SELECT m.Name AS 'Name', t.*   FROM transactionhistory t
    JOIN merchants m ON m.id=t.Merchant_ID
    WHERE Date(t.dateTime) = CURDATE() AND t.transactionType = 1`, { type: models.sequelize.QueryTypes.SELECT }).then((data) => {
        res.json({ message: 'success', data })
    }).catch((err) => {
        res.status(500).send({
            message: 'error', error: err
        });
    });
};

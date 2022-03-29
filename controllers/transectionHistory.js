const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');
const { Op } = require('sequelize')
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
    models.sequelize.query(`SELECT m.Name AS 'Name', t.* FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID WHERE t.Client_id = ${Client_id}`,
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
const updatePayback = async (issuancehistory_Id, AmountUser, type) => {
    const allPaybacks = await models.paybackPeriod.findAll({
        where: {
            issuanceHistory_Id: issuancehistory_Id,
        }
    })
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
    if (!miData || !merchantData) return null
    const merchanttypediscount = await models.merchanttypediscount.findOne({
        where: {
            id: miData.numberOfMonthsId,
            MerchantType_id: merchantData.MerchantType_id
        }
    })
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
    if (interestOn.toLocaleLowerCase() == "client") {
        const Interest = await getNumberOfMonthsAndInterest(row.issuancehistoryId, row.Merchant_ID)
        if (!Interest) return null
        AmountUser = AmountUser + AmountUser * parseFloat(Interest) / 100
    }
    await updatePayback(row.issuancehistoryId, AmountUser, parseInt(row.transactionType))
}


// ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END 
// ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END // ON TRANSACTION FUNCTIONALITY END  

const getMerchant_ID = async (token) => {
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
    const Merchant_ID = await getMerchant_ID(_.get(req.headers, 'authorization', null).split(' ')[1])
    if (!Merchant_ID) {
        res.status(400).send({
            message: 'This User doesnt exist as a merchant'
        });
    }
    models.sequelize.query(`SELECT m.Name AS 'Name', t.* , COUNT(p.id) AS totalPaybackPeriods FROM transactionhistory t
    JOIN merchants m ON m.id = t.Merchant_ID
    JOIN paybackperiods p ON p.issuanceHistory_Id = t.issuancehistoryId 
    WHERE (Date(t.dateTime) = CURDATE() AND t.Merchant_ID = '${Merchant_ID}'
    group BY t.id)`,
        { type: models.sequelize.QueryTypes.SELECT }).then((data) => {
            res.json({ message: 'success', data })
        }).catch((err) => {
            res.status(500).send({
                message: 'error', error: err
            });
        });
}
exports.createTransactionHistory = async (req, res) => {
    const { Client_id,
        ItemDescription,
        dateTime,
        AmountUser,
        issuancehistoryId,
        transactionType } = req.body;
    const Merchant_ID = await getMerchant_ID(_.get(req.headers, 'authorization', null).split(' ')[1])

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
    models.transactionhistory.create({
        id: uuidV4(),
        Client_id,
        Merchant_ID,
        ItemDescription,
        dateTime,
        AmountUser,
        issuancehistoryId,
        transactionType
    }).then(data => {
        handleTransactionEntry(data)
        res.json({ message: 'success', data: data });
    }).catch(err => {
        res.status(500).send({
            message: 'error',
            error: err
        });
    });
};
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
            amount += parseInt(data[i].AmountUser)
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

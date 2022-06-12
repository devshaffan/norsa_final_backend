const models = require('../models/index');
const fs = require('fs')
const { Op } = require("sequelize");
const _ = require('lodash');
const uuidV4 = require('uuid/v4');
const { getMerchant_ID } = require('./transectionHistory');



exports.getClientByNfcAndPinCode = (req, res) => {
  const { pinCode, nfcCardId } = req.body;
  if (!pinCode || !nfcCardId) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.sequelize.query(`SELECT ih.Client_id FROM nfccard nc
  JOIN issuancehistory ih ON ih.NfcCard_id=nc.id
  WHERE nc.number = ${nfcCardId} AND ih.Pincode = ${pinCode}
  ORDER BY ih.DateTime DESC 
  LIMIT 1
  `, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
    return res.json({ result: 'ok', data });
  }).catch(err => {
    return res.json({ result: 'fail', message: err });
  });
}
const getUserAgainstAnyMerchant = async (merchants) => {
  return await models.merchants
    .findOne({
      where: {
        id: merchants
      },
      attributes: ['User_id']
    })
}



const checkIfMerchantExists = async (issuanceHistoryId, merchantId) => {
  const data = await models.multipleIssueances.findAll({ where: { issuanceHistoryId: issuanceHistoryId, merchantId: merchantId } })
  if (!data) return null
  return data
}
const checkIfMerchantExistsOld = async (issuanceHistoryId, merchantId) => {
  const data = await models.multipleIssueances.findOne({ where: { issuanceHistoryId: issuanceHistoryId, merchantId: merchantId } })
  if (!data) return null
  return data
}
const checkIfIssuanceHistoryIdExists = async (issuanceHistoryId) => {
  const data = await models.multipleIssueances.findOne({ where: { issuanceHistoryId: issuanceHistoryId } })
  if (!data) return null
  return data
}
const checkIfUserAuthorized = async (user, token) => {
  const authorizedUsers = await models.user.findOne({
    where: {
      id: user,
      accessToken: token
    }
  })
  // return authorizedUsers
  return authorizedUsers ? true : false
}
const getClientCodeAndName = async (id) => {
  return await models.client.findOne({
    where: {
      id: id
    },
    attributes: ['Code', 'FirstName', 'LastName']
  })
}
const getUserId = async (token) => {
  return await models.user.findOne({ where: { accessToken: token } })
}
const getPaybackPeriodDate = async (issuanceHistoryId) => {
  const result = await models.paybackPeriod.findOne({
    where: {
      issuanceHistory_Id: issuanceHistoryId
    },
    order: [["date", "ASC"]],
    attributes: ['date']
  })
  return result
}
const getPaybackPeriodCount = async (issuanceHistoryId) => {
  const count = await models.paybackPeriod.count({
    where: { issuanceHistory_Id: issuanceHistoryId }
  })
  return count
}
const getNonExistantIssuanceInMultipleIssuanes = async (issuanceHistories) => {

  const issuanceIds = issuanceHistories.map(itm => itm.id)
  const data = await models.sequelize.query(`SELECT i.* FROM issuanceHistory i 
  LEFT JOIN multipleIssueances mi ON mi.issuancehistoryid = i.id
  WHERE mi.id IS NULL AND i.id IN (:issuanceIds)`, {
    replacements: { issuanceIds: issuanceIds },
    type: models.sequelize.QueryTypes.SELECT
  })
  let issuanceHistory;
  if (!data || data.length == 0) {
    return null
  }
  else {
    issuanceHistory = issuanceHistories.filter(item => item.id == data[0].id)[0]
  }
  return issuanceHistory
}
exports.getMaxRemainingCreditClient = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const { id } = req.params
  const data = await models.sequelize.query(
    `SELECT c.MaxBorrowAmount - SUM(i.Amount) AS 'Remaining'
      FROM issuancehistory i
      JOIN client c ON c.id = i.Client_id
      WHERE MONTH(i.DateTime) = MONTH(NOW())
      AND c.id = '${id}'`
    , { type: models.sequelize.QueryTypes.SELECT })
  const amount = data.Remaining ? data.Remaining < 0 ? 0 : data.Remaining : 0
  res.json({ message: 'success',  amount })
  return
}
exports.OnNfcAndPinCode = async (req, res) => {
  const { nfcCardId } = req.body;
  const token = _.get(req.headers, 'authorization', null).split(' ')[1]
  const merchant_id = await getMerchant_ID(token)

  if (!nfcCardId) {
    res.status(400).send({ message: 'success', error: 'Content can not be empty!' });
    return;
  }
  if (!merchant_id) {
    res.status(400).send({ message: 'success', error: 'Merchant doesnt exist!' });
    return;
  }
  // const data = await models.issuancehistory.findOne({
  //   where: { NfcCard_id: nfcCardId },
  //   order: [['DateTime', 'DESC']]
  // })
  const data = await models.sequelize.query(`SELECT  * FROM issuancehistory i WHERE (i.NfcCard_id = '${nfcCardId}' AND i.AmountPaid='0' AND MONTH(i.DateTime) = MONTH(CURDATE()))`, { type: models.sequelize.QueryTypes.SELECT })
  // const data = await models.issuancehistory.findAll({
  //   where: {
  //     NfcCard_id: nfcCardId, AmountPaid: 0, DateTime : {
  //       op.
  //     }
  //   }});
  if (!data || data.length == 0) {
    res.status(400).send({ message: 'success', error: "Invalid Card! data" })
    return
  }


  // const multipleIssuancesList = await checkIfMerchantExists(data.id)
  let multipleIssuances = null;
  let issuanceData = null
  for (var i = 0; i < data.length; i++) {
    multipleIssuances = await checkIfMerchantExistsOld(data[i].id, merchant_id)
    if (multipleIssuances) {
      issuanceData = data[i];
      // multipleIssuances.push(multipleIssuance)
      break;
    }
  }
  if (!multipleIssuances) {
    issuanceData = await getNonExistantIssuanceInMultipleIssuanes(data)
    if (!issuanceData) {
      res.status(400).send({ message: 'success', error: "Invalid Card!" })
      return
    }
  }
  const paybackPeriod = await getPaybackPeriodDate(issuanceData.id)
  if (!multipleIssuances) {
    if (!data[0].Client_id) {
      res.status(400).send({ message: 'success', error: "Invalid Card! multipleIssuances" })
      return
    }
    const client = await getClientCodeAndName(data[0].Client_id)
    if (!client) {
      res.status(400).send({ message: 'success', error: "Invalid Card! client" })
      return
    }
    const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths: 1 }
    // const issuanceData = data[0]
    res.json({ message: 'success', data: { data: issuanceData, clientCodeAndFullName, paybackPeriod } })
    return;
  }

  const user = await getUserAgainstAnyMerchant(multipleIssuances.merchantId)
  if (!user) {
    res.status(400).send({ message: 'success', error: "Invalid Card! user" })
    return
  }
  const authorized = await checkIfUserAuthorized(user.User_id, token)
  if (!authorized) {
    res.status(400).send({ message: 'success', error: "Invalid Card! authorized" })
    return;
  }
  if (!data[0].Client_id) {
    res.status(400).send({ message: 'success', error: "Invalid Card! data[0].Client_id" })
    return
  }
  // get that issuance history which is against multiple issuances

  const client = await getClientCodeAndName(issuanceData.Client_id)
  if (!client) {
    res.status(400).send({ message: 'success', error: "Invalid Card! client2" })
    return
  }
  const numberOfMonths = await getNumberOfMonths(multipleIssuances.numberOfMonthsId)
  const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths }
  res.json({ message: 'success', data: { data: issuanceData, clientCodeAndFullName, paybackPeriod } })
}
const getMerchantById = async (id) => {
  const data = await models.merchants.findByPk(id)
  return data
}
const getInterestOnByMerchantTypeId = async (id) => {
  const data = models.merchanttype
    .findOne({
      where: {
        id: id
      },
      attributes: ['interestOn']
    })
  return data
}
const getPaybackPeriodCountByMerchantType = async (issuanceHistoryId, type) => {
  const count = await models.paybackPeriod.count({
    where: {
      issuanceHistory_Id: issuanceHistoryId,
      type: type
    }
  })
  return count
}

exports.OnNfcAndPinCodeMultipleIssuance = async (req, res) => {
  const { nfcCardId } = req.body;
  const token = _.get(req.headers, 'authorization', null).split(' ')[1]
  const merchant_id = await getMerchant_ID(token)

  if (!nfcCardId) {
    res.status(400).send({ message: 'success', error: 'Content can not be empty!' });
    return;
  }
  if (!merchant_id) {
    res.status(400).send({ message: 'success', error: 'Merchant doesnt exist!' });
    return;
  }
  const merchantTypeId = (await getMerchantById(merchant_id)).MerchantType_id
  const { interestOn } = await getInterestOnByMerchantTypeId(merchantTypeId)

  const data = await models.sequelize.query(`SELECT  * FROM issuancehistory i WHERE (i.NfcCard_id = '${nfcCardId}' AND i.AmountPaid='0' AND MONTH(i.DateTime) = MONTH(CURDATE()))`, { type: models.sequelize.QueryTypes.SELECT })

  if (!data || data.length == 0) {
    res.status(400).send({ message: 'success', error: "Invalid Card! data" })
    return
  }
  // const multipleIssuancesList = await checkIfMerchantExists(data.id)
  let issuances = [];
  for (var i = 0; i < data.length; i++) {
    const multipleIssuancesAgainstIssuanceHistory = await checkIfMerchantExists(data[i].id, merchant_id)
    if (multipleIssuancesAgainstIssuanceHistory.length > 0) {
      const paybackPeriodDate = await getPaybackPeriodDate(data[i].id)
      const paybackPeriodCount = await getPaybackPeriodCount(data[i].id)
      const client = await getClientCodeAndName(data[i].Client_id)
      if (!client) {
        res.status(400).send({ message: 'success', error: "Invalid Card! client2" })
        return
      }
      // const numberOfMonths = await getNumberOfMonths(multipleIssuance.numberOfMonthsId)
      const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths: paybackPeriodCount }
      issuances.push({
        data: data[i], multipleIssuancesAgainstIssuanceHistory, paybackPeriodDate: paybackPeriodDate,
        paybackPeriodCount: paybackPeriodCount, clientCodeAndFullName
      })
    }
    else {
      const outlierIssuance = await checkIfIssuanceHistoryIdExists(data[i].id)
      if (!outlierIssuance) {
        const paybackPeriod = await getPaybackPeriodDate(data[i].id)
        let paybackPeriodCount;
        if (interestOn.toLocaleLowerCase() == "client") {
          paybackPeriodCount = await getPaybackPeriodCountByMerchantType(data[i].id, 1)
        }
        else {
          paybackPeriodCount = await getPaybackPeriodCountByMerchantType(data[i].id, 2)
        }
        const client = await getClientCodeAndName(data[i].Client_id)
        if (!client) {
          res.status(400).send({ message: 'success', error: "Invalid Card! client2" })
          return
        }
        const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths: paybackPeriodCount }
        issuances.push({
          data: data[i], issuance: outlierIssuance, paybackPeriod: paybackPeriod,
          paybackPeriodCount: paybackPeriodCount, clientCodeAndFullName
        })
      }
    }
  }
  res.json({ message: 'success', data: issuances })
  return;
}

const getNumberOfMonths = async (id) => {
  const data = await models.merchanttypediscount.findByPk(id)
  if (data) {
    return data.NumberOfMonths
  }
  return null
}
exports.getIssueanceHistyByClientId = (req, res) => {
  const clientId = req.params.Client_id;
  models.issuancehistory.findOne({ where: { Client_id: clientId, AmountPaid: '0' }, order: [['DateTime', 'DESC']] })
    .then(data => {
      res.json({ message: 'success', data: data })
    })
    .catch(err => {
      res.status(500).json({ message: 'error', data: err.message })
    });
};
exports.getAllIssuancehistories = (req, res) => {
  const limit = req.params.limit !== undefined ? req.params.limit : 10000;
  const offset = req.params.offset !== undefined ? req.params.limit : 0;
  models.issuancehistory
    .findAll({ limit, offset })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All issuancehistory.',
      });
    });
};

exports.getAllIssuancehistoriesByAmountPaid = (req, res) => {
  const limit = req.params.limit !== undefined ? req.params.limit : 10000;
  const offset = req.params.offset !== undefined ? req.params.limit : 0;
  models.issuancehistory
    .findAll({
      where: {
        AmountPaid: null
      } ||
      {
        AmountPaid: 0
      }
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All issuancehistory.',
      });
    });
};

exports.getissuancehistoryById = (req, res) => {
  models.issuancehistory
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);

    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Issuancehistory Record .',
      });
    });
};
exports.getissuancehistoryByClientId = (req, res) => {
  models.issuancehistory
    .findAll({
      where: {
        Client_id: req.params.Client_id
      }
    })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All issuancehistory.',
      });
    });
};
exports.getissuancehistoryByPincodeAndNfcCard_id = (req, res) => {
  models.issuancehistory
    .findAll({
      where: {
        Pincode: req.params.Pincode,
        NfcCard_id: req.params.NfcCard_id
      }
    })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All issuancehistory.',
      });
    });
};
exports.createIssuancehistory = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  // const currentDate = new Date()
  // currentDate.setHours(20, 0, 0, 0)
  // console.log(currentDate.toISOString().split("T")[1])
  // req.body.DateTime = req.body.DateTime + "T" + currentDate.toISOString().split("T")[1]
  // console.log(req.body.DateTime)
  models.issuancehistory
    .create(req.body)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Issuancehistory.',
      });
    });
};

exports.upsertIssuancehistory = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.issuancehistory
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Issuancehistory.',
      });
    });
};

exports.deleteIssuancehistory = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;

  await models.multipleIssueances.destroy({ where: { issuanceHistoryId: id } })
  await models.paybackPeriod.destroy({ where: { issuanceHistory_Id: id } })
  await models.transactionhistory.destroy({ where: { issuanceHistoryId: id } })
  await models.insurance.destroy({ where: { issuanceHistoryFk: id } })

  models.issuancehistory
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'Issuancehistory was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete Issuancehistory with id=${id}. Maybe Issuancehistory was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting Issuancehistory.',
      });
    });
};

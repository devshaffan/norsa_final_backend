const models = require('../models/index');
const fs = require('fs')

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
  const data = await models.multipleIssueances.findOne({ where: { issuanceHistoryId: issuanceHistoryId, merchantId: merchantId } })
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
  const data = await models.issuancehistory.findAll({
    where: { NfcCard_id: nfcCardId, AmountPaid: 0 },
  })

  if (!data || data.length == 0) {
    res.status(400).send({ message: 'success', error: "Invalid Card! data" })
    return
  }
  // const multipleIssuancesList = await checkIfMerchantExists(data.id)
  let multipleIssuances = null;
  let issuanceData = null
  for (var i = 0; i < data.length; i++) {
    multipleIssuances = await checkIfMerchantExists(data[i].id, merchant_id)
    if (multipleIssuances) {
      issuanceData = data[i];
      // multipleIssuances.push(multipleIssuance)
      break;
    }
  }

  /*task to be done 26/4
  
  1. get all issuance history id
  2. get all unique inssuance history id that matches with the merchant id in multiple issuances
  3. get one issuance history id that doesnt exist in multiple issuance 
  4. combine 2 3
  5. check payback period date count against issuance history id of 4
  6. return [{issuancehistory1, paybackperiod1},
            {issuancehistory2, paybackperiod2}]
  7. return previous + paybackCount
  */

  // if (!multipleIssuancesList) {
  //   res.status(400).send({ message: 'success', error: "Invalid Card!" })
  //   return
  // }
  const paybackPeriod = await getPaybackPeriodDate(issuanceData ? issuanceData.id : data[0].id)
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
    const issuanceData = data[0]
    res.json({ message: 'success', data: { data: issuanceData, clientCodeAndFullName, paybackPeriod } })
    return;
  }

  const user = await getUserAgainstAnyMerchant(multipleIssuances.merchantId)
  if (!user) {
    res.status(400).send({ message: 'success', error: "Invalid Card! user" })
    return
  }
  // const userIds = users.map((item) => {
  //   return item.User_id
  // })
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

const models = require('../models/index');
const fs = require('fs')

const _ = require('lodash');
const { JSON } = require('sequelize');


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
const getUsersAgainstAnyMerchant = async (merchants) => {
  return await models.merchants
    .findAll({
      where: {
        id: merchants
      },
      attributes: ['User_id']
    })
}

const checkIfMerchantExists = async (issuanceHistoryId) => {
  const data = await models.multipleIssueances.findAll({ where: { issuanceHistoryId: issuanceHistoryId } })
  return data
}

const checkIfUserAuthorized = async (users, token) => {
  const authorizedUsers = await models.user.findAll({
    where: {
      id: users,
      accessToken: token
    }
  })
  // return authorizedUsers
  return authorizedUsers.length > 0 ? true : false
}
const getClientCodeAndName = async (id) => {
  return await models.client.findOne({
    where: {
      id: id
    },
    attributes: ['Code', 'FirstName', 'LastName']
  })
}

exports.OnNfcAndPinCode = async (req, res) => {
  const { pinCode, nfcCardId } = req.body;
  if (!pinCode || !nfcCardId) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const data = await models.issuancehistory.findOne({
    where: { NfcCard_id: nfcCardId },
    order: [['DateTime', 'DESC']]
  })
  if (!data) {
    res.json({ message: 'success', error: "Nfc Card Id and PinCode doesnt match" })
    return
  }
  const multipleIssuancesList = await checkIfMerchantExists(data.id)

  if (!multipleIssuancesList) {
    res.json({ message: 'success', error: "Merchant doesnt exist" })
    return
  }

  if (multipleIssuancesList.length == 0) {
    if (!data.Client_id) {


      res.json({ message: 'success', error: "Client ID doesnt exist" })
      return
    }
    const client = await getClientCodeAndName(data.Client_id)
    if (!client) {
      res.json({ message: 'success', error: "Client doesnt exist" })
      return
    }
    const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths: 1 }
    res.json({ message: 'success', data: { data, clientCodeAndFullName } })
    return;
  }
  const merchants = multipleIssuancesList.map((item) => {
    return item.merchantId
  })
  const users = await getUsersAgainstAnyMerchant(merchants)
  if (!users || users.length == 0) {
    res.json({ message: 'success', error: "Client doesnt exist" })
    return
  }
  const userIds = users.map((item) => {
    return item.User_id
  })
  const token = _.get(req.headers, 'authorization', null).split(' ')[1]
  const authorized = await checkIfUserAuthorized(userIds, token)
  if (!authorized) {
    res.json({ message: 'success', error: "Not Authorized" })
    return;
  }
  if (!data.Client_id) {
    res.json({ message: 'success', error: "Client ID doesnt exist" })
    return
  }
  const client = await getClientCodeAndName(data.Client_id)
  if (!client) {
    res.json({ message: 'success', error: "Client doesnt exist" })
    return
  }
  const numberOfMonths = await getNumberOfMonths(multipleIssuancesList[0].numberOfMonthsId)
  const clientCodeAndFullName = { Code: client.Code, FullName: client.FirstName + " " + client.LastName, numberOfMonths }
  res.json({ message: 'success', data: { data, clientCodeAndFullName } })
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
    .then((data) => res.json(data))
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

exports.deleteIssuancehistory = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
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

const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const { getUniqueString } = require('../utils/utils');

exports.getAll = (req, res) => {
  models.sequelize.query(`SELECT d.*, u.email AS email, c.Code AS Code, c.FirstName AS FirstName, c.LastName AS LastName
    FROM dealerbulkpayment d
    JOIN users u ON u.id=d.createdByUserId
    JOIN client c ON c.id=d.Dealer
  `, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
    return res.json(data)
  }).catch(err => {
    res.status(500).send({ error: err })
  })
};

exports.getById = (req, res) => {
  if (!req.params.id) {
    res.status(500).send({ err: "id cannot be empty" })
    return
  }
  models.sequelize.query(`SELECT d.*, u.email AS email, c.Code AS code, c.FirstName AS FirstName, c.LastName AS LastName
  FROM dealerbulkpayment d
  JOIN users u ON u.id=d.createdByUserId
  JOIN client c ON c.id=d.Dealer
  WHERE d.id='${req.params.id}'
  LIMIT 1
`, { type: models.sequelize.QueryTypes.SELECT }).then(data => {
    return res.json(data)
  }).catch(err => {
    res.status(500).send({ error: err })
  })
};

exports.create = (req, res) => {
  const data = { ...req.body, id: uuidV4(), InvoiceNumber: req.body.InvoiceNumber ||  getUniqueString(7) }
  if (!data.Dealer.includes("D")) {
    res.status(500).send({ err: "client should start with D" })
    return
  }
  models.dealerBulkPayment
    .create(data)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the dealer.',
      });
    });
};

exports.update = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const data = { ...req.body, InvoiceNumber: req.body.InvoiceNumber || getUniqueString(7) }

  models.dealerBulkPayment
    .upsert(data)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the dealer.',
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.dealerBulkPayment
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'dealer was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting dealer.',
      });
    });
};

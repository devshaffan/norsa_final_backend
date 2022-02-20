const { sequelize } = require('../models/index');
const models = require('../models/index');

exports.getAllNfcCards = (req, res) => {
  const limit = req.params.limit ? null : 10000;
  const offset = req.params.offset ? null : 0;
  models.nfcCard
    .findAll({
      limit, offset,
      order: [
        [sequelize.cast(sequelize.col('number'), 'INT'), 'ASC'],
      ],
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All nfcCard.',
      });
    });
};

exports.getNfcCardById = (req, res) => {
  models.nfcCard
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving nfcCard Record .',
      });
    });
};

exports.createNfcCard = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.nfcCard
    .create(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the nfcCard.',
      });
    });
};

exports.upsertNfcCard = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.nfcCard
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the nfcCard.',
      });
    });
};

exports.deleteNfcCard = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.nfcCard
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'nfcCard was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete nfcCard with id=${id}. Maybe nfcCard was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting nfcCard.',
      });
    });
};

const models = require('../models/index');

exports.getAllDevices = (req, res) => {
  const limit = req.params.limit !== undefined ? req.params.limit : 1000;
  const offset = req.params.offset !== undefined ? req.params.limit : 0;
  models.device
    .findAll({ limit, offset })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All device.',
      });
    });
};

exports.getDeviceById = (req, res) => {
  models.device
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving device Record .',
      });
    });
};

exports.createDevice = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.device
    .create(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the device.',
      });
    });
};

exports.upsertDevice = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.device
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the device.',
      });
    });
};

exports.deleteDevice = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.device
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'device was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete Device with id=${id}. Maybe device was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting device.',
      });
    });
};

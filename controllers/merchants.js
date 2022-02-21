const models = require('../models/index');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');

exports.getAllMerchants = (req, res) => {
  const limit = req.params.limit ? null : 1000;
  const offset = req.params.offset ? null : 0;
  models.merchants
    .findAll({ limit, offset })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All merchants.',
      });
    });
};

exports.getMerchantById = (req, res) => {
  models.merchants
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving merchants Record .',
      });
    });
};
exports.getMerchantNameByUserId = async (req, res) => {
  const token = _.get(req.headers, 'authorization', null).split(' ')[1]

  const authorizedUser = await models.user.findOne({
    attributes: ['id'],
    where: {
      accessToken: token
    }
  })
  if (!authorizedUser) {
    res.status(500).send({
      message:
        'user doesnt exist .',
    });
  }
  const merchant = await models.merchants.findOne({
    attributes: ['Name'],
    where: {
      User_id: authorizedUser.id,
    }
  })
  if (!merchant) {
    res.status(500).send({
      message:
        'No merchant exist .',
    });
    return
  }
  res.json(merchant);
  return
}


exports.createMerchant = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchants
    .create(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the merchants.',
      });
    });
};

exports.upsertMerchant = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchants
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the merchants.',
      });
    });
};

exports.deleteMerchant = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.merchants
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'merchants was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete merchants with id=${id}. Maybe merchants was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting merchants.',
      });
    });
};


exports.getAllMerchantTypes = (req, res) => {
  const limit = req.params.limit ? null : 10000;
  const offset = req.params.offset ? null : 0;
  models.merchanttype
    .findAll({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All MerchantTypes.',
      });
    });
};

exports.getMerchantTypeById = (req, res) => {
  models.merchanttype
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving MerchantTypes Record .',
      });
    });
};

exports.createMerchantType = (req, res) => {
  const id = uuidV4();
  req.body.id = id
  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchanttype
    .create(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the MerchantTypes.',
      });
    });
};

exports.upsertMerchantType = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchanttype
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the merchants.',
      });
    });
};

exports.deleteMerchantType = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.merchanttype
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'MerchantTypes was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete MerchantTypes with id=${id}. Maybe MerchantTypes was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting MerchantTypes.',
      });
    });
};

exports.getAllMerchantTypeDiscounts = (req, res) => {
  const limit = req.params.limit ? null : 1000;
  const offset = req.params.offset ? null : 0;
  models.merchanttypediscount
    .findAll({ limit, offset })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving All MerchantTypeDiscounts.',
      });
    });
};

exports.getMerchantTypeDiscountById = (req, res) => {
  models.merchanttypediscount
    .findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving MerchantTypeDiscounts Record .',
      });
    });
};

exports.getMerchantTypeDiscountByMerchantType_id = (req, res) => {
  models.merchanttypediscount
    .findAll({
      where: {
        MerchantType_id: req.params.MerchantType_id
      }
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving MerchantTypeDiscounts Record .',
      });
    });
};

exports.createMerchantTypeDiscount = (req, res) => {
  const id = uuidV4();
  req.body.id = id
  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchanttypediscount
    .create(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the MerchantTypeDiscounts.',
      });
    });
};

exports.upsertMerchantTypeDiscount = (req, res) => {

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  models.merchanttypediscount
    .upsert(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the MerchantTypeDiscounts.',
      });
    });
};

exports.deleteMerchantTypeDiscount = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.merchanttypediscount
    .destroy({
      where: {
        id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'merchants was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete merchants with id=${id}. Maybe merchants was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting merchants.',
      });
    });
};

exports.deleteMerchantTypeDiscountByMerchantType_id = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const id = req.params.id;
  models.merchanttypediscount
    .destroy({
      where: {
        MerchantType_id: id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'merchants was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete merchants with id=${id}. Maybe merchants was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting merchants.',
      });
    });
};

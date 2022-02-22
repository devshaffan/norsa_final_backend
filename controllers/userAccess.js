const models = require('../models/index');


exports.checkAdminStatus = (req, res) => {
  models.user
    .findOne({ where: { email: req.body.email } })
    .then((data) => {
      if (!data) {
        res.status(400).send({ result: 'error', message: 'not found user with your email' });
      }
      res.json(data.isAdmin);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving CLient Record .',
      });
    });
};

exports.changeUserStatus = (req, res) => {
  const { email, status } = req.body;
  // eslint-disable-next-line vars-on-top
  var val = 0;
  switch (status) {
    case 'Admin': val = 1; break;
    case 'User': val = 0; break;
    case 'Merchant':val = 3; break;
    default: val = 0; break;
  }
  models.user
    .update({ isAdmin: val }, { where: { email } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while updating Admin status .',
      });
    });
};


exports.dormantUser = (req, res) => {
  const email = req.body.email;

  models.user
    .findOne({ where: { email } })
    .then((user) => {
      let { dormantUser } = user;
      //console.log(dormantUser);
      if (dormantUser) {
        dormantUser = 0;
      } else {
        dormantUser = 1;
      }
      //console.log(dormantUser);
      models.user
        .update({ dormantUser }, { where: { email } })
        .then(() => {
          res.json('sucess');
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while dormanting Record .',
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while dormanting Record .',
      });
    });
};


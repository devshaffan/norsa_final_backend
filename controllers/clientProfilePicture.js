const fs = require('fs')
const models = require('../models/index');
const s3 = require("../config/aws")
const path = require('path')
const uuidV4 = require('uuid/v4');

const _uniqueId = require('lodash.uniqueid');

exports.getImageById = (req, res) => {

  models.clientProfilePicture
    .findByPk(req.params.id)
    .then((data) => {
      console.log(data);
      const file = path.join(__dirname, "../public/images/", data.filePath);
      res.download(file); // Set disposition and send it.
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving CLient Record .',
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.Client_id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  const Client_id = req.params.Client_id;
  models.clientProfilePicture
    .destroy({
      where: {
        Client_id
      },
    })
    .then((num) => {
      if (num === 1) {
        res.send({ message: 'Client Image was deleted successfully!' });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${Client_id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while Deleting client.',
      });
    });
};


exports.getImageByClientId = (req, res) => {
  //  res.json({id : req.params.id})
  models.clientProfilePicture
    .find({
      where: {
        Client_id: `${req.params.id}`
      }
    })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving CLient Record .',
      });
    });
};


exports.createImage = async (req, res) => {
  const id = uuidV4()
  // if (!req.body.id) {
  //   res.status(400).send({ message: 'Content can not be empty!' });
  //   return;
  // }
  if (!req.file) {
    res.status(400).send({ message: 'No File Uploaded!' });
    return;
  }
  const key = `userAvatar/-${Date.now()}${req.file.originalname}`
  var params = {
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME || "norsa",
    Body: fs.createReadStream(req.file.path),
    Key: key
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.log('Error occured while trying to upload to S3 bucket', err);
    }
    if (data) {
      fs.unlinkSync(req.file.path); // Empty temp folder
      const locationUrl = data.Location;
      var insertData = {
        filePath: key,
        id: id,
        Client_id: req.body.Client_id,
        avatar: locationUrl,
      }
      models.clientProfilePicture
        .upsert(insertData)
        .then((data) => res.json(data))
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the CLient.',
          });
        });

    }
  });
}


// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     // Upload image to cloudinary
//      // Create new user
//     let user = new User({
//       name: req.body.name,
//       avatar: result.secure_url,
//       cloudinary_id: result.public_id,
//     });
//     // Save user
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }}); 
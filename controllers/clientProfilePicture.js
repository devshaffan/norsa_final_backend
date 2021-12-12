const models = require('../models/index');
const cloudinary = require("../config/cloudinary");

const express = require('express')



const path = require('path')

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
  console.log("id is " + req.file)

  if (!req.body.id) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }
  if (!req.file) {
    res.status(400).send({ message: 'No File Uploaded!' });
    return;
  }
  const result = await cloudinary.uploader.upload(req.file.path)
 
  var insertData = {
    filePath: req.file.filename,
    id: req.body.id,
    Client_id: req.body.Client_id,
    avatar: result.secure_url,
    cloudinary_id: result.public_id,
  }
  models.clientProfilePicture
    .upsert(insertData)
    .then((data) => res.json(result))
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the CLient.',
      });
    });
};


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
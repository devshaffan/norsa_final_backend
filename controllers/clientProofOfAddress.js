const fs = require('fs')
const models = require('../models/index');
const s3 = require("../config/aws")
const path = require('path')
const uuidV4 = require('uuid/v4');


exports.getFileByClientId = (req, res) => {
    models.clientProofOfAddress
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
}



exports.delete = (req, res) => {
    if (!req.params.Client_id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    const Client_id = req.params.Client_id;
    models.clientProofOfAddress
        .destroy({
            where: {
                Client_id
            },
        })
        .then((num) => {
            if (num === 1) {
                res.send({ message: 'Client Proof Of Address was deleted successfully!' });
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


exports.createFile = async (req, res) => {
    const id = uuidV4()
    // if (!req.body.id) {
    //   res.status(400).send({ message: 'Content can not be empty!' });
    //   return;
    // }
    if (!req.file) {
      res.status(400).send({ message: 'No File Uploaded!' });
      return;
    }
    const client = await models.clientProofOfAddress.findOne({where : {
        Client_id : req.body.Client_id
    }})
    if(client) {
        return res.status(500).send({err : "client proof of address already exists"})
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
        //console.log('Error occured while trying to upload to S3 bucket', err);
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
        models.clientProofOfAddress
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











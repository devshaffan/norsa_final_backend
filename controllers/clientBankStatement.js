const fs = require('fs')
const models = require('../models/index');
const s3 = require("../config/aws")
const path = require('path')


exports.getFile1ByClientId = (req, res) => {
    models.clientBankStatement
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


exports.getFile2ByClientId = (req, res) => {
    models.clientBankStatement
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


exports.addFile = (req, res) => {

    console.log("id is " + req.file)

    if (!req.body.id) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }
    var params = {
        ACL: 'public-read',
        Bucket: process.env.BUCKET_NAME || "norsa",
        Body: fs.createReadStream(req.files['file1'][0].path),
        Key: `userAvatar/-${Date.now()}${req.files['file1'][0].originalname}`
    };
    var file1Path;
    s3.upload(params, (err, data) => {
        if (err) {
            console.log('Error occured while trying to upload to S3 bucket', err);
        }
        if (data) {
            fs.unlinkSync(req.files['file1'][0].path); // Empty temp folder
            file1Path = data.Location;
            params = {
                ACL: 'public-read',
                Bucket: process.env.BUCKET_NAME || "norsa",
                Body: fs.createReadStream(req.files['file2'][0].path),
                Key: `userAvatar/-${Date.now()}${req.files['file2'][0].originalname}`
            };
            var file2Path;
            s3.upload(params, (err, data) => {
                if (err) {
                    console.log('Error occured while trying to upload to S3 bucket', err);
                }
                if (data) {
                    fs.unlinkSync(req.files['file2'][0].path); // Empty temp folder
                    file2Path = data.Location;
                    var insertData = {
                        file1Path: file1Path,
                        file2Path: file2Path,
                        id: req.body.id,
                        Client_id: req.body.Client_id
                    }
                    models.clientBankStatement
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
    });


}








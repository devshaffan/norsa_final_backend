const models = require('../models/index');



exports.getFile1ByClientId = (req, res) => {
    models.clientSalarySlip
        .find({
            where: {
                Client_id: `${req.params.id}`
            }
        })
        .then((data) => {
            console.log(data);
            const file = path.join(__dirname, "../public/pdf/", data.file1Path);

            res.download(file); // Set disposition and send it.
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving CLient Record .',
            });
        });
}


exports.getFile2ByClientId = (req, res) => {
    models.clientSalarySlip
        .find({
            where: {
                Client_id: `${req.params.id}`
            }
        })
        .then((data) => {
            console.log(data);
            const file = path.join(__dirname, "../public/pdf/", data.file2Path);
            res.download(file); // Set disposition and send it.
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while retrieving CLient Record .',
            });
        });
}
exports.addFile = (req, res) => {

    var insertData = {
        file1Path: req.files['file1'][0].filename,
        file2Path: req.files['file2'][0].filename,
        id: req.body.id,
        Client_id: req.body.Client_id
    }

    models.clientSalarySlip
        .upsert(insertData)
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || 'Some error occurred while creating the CLient.',
            });
        });
};



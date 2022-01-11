const models = require('../models/index');

exports.getAllByIssuancesId = (req, res) => {
    const issuancesId = req.params.issuancesId;
    if(!issuancesId){
        return res.status(400).send({status: 'error', message: 'Missing parameter: issuancesId'}); 
    }
    models.multipleIssueances.findAll({where: {issuancehistoryId:issuancesId}}).then(data => {
        res.status(200).send({status: 'success', data: data});
    }).catch(err => {
        res.status(500).send({status: 'error', message: err.message});
    });
};
exports.getAllByMerchantId = (req, res) => {
    const merchantId = req.params.merchantId;
    if(!merchantId){
        return res.status(400).send({status: 'error', message: 'Missing parameter: merchantId'}); 
    }
    models.multipleIssueances.findAll({where: {merchantId:merchantId}}).then(data => {
        res.status(200).send({status: 'success', data: data});
    }).catch(err => {
        res.status(500).send({status: 'error', message: err.message});
    });
};
exports.createMultipleIssueances = (req, res) => {
    const issuancehistoryId = req.body.issuancehistoryId;
    const merchantId = req.body.merchantId;
    const numberOfMonthsId = req.body.numberOfMonthsId;
    if(!issuancehistoryId || !merchantId || !numberOfMonthsId){
        return res.status(400).send({status: 'error', message: 'Missing parameter: issuancehistoryId, merchantId or numberOfMonthsId'}); 
    }
    models.multipleIssueances.create({
        issuancehistoryId: issuancehistoryId,
        merchantId: merchantId,
        numberOfMonthsId: numberOfMonthsId
    }).then(data => {
        res.status(200).send({status: 'success', data: data});
    }).catch(err => {
        res.status(500).send({status: 'error', message: err.message});
    });
};
exports.updateMultipleIssueances = (req, res) => {
    const id = req.body.id;
    const issuancehistoryId = req.body.issuancehistoryId;
    const merchantId = req.body.merchantId;
    const numberOfMonthsId = req.body.numberOfMonthsId;
    if(!id || !issuancehistoryId || !merchantId || !numberOfMonthsId){
        return res.status(400).send({status: 'error', message: 'Missing parameter: id, issuancehistoryId, merchantId or numberOfMonthsId'}); 
    }
    models.multipleIssueances.update({
        issuancehistoryId: issuancehistoryId,
        merchantId: merchantId,
        numberOfMonthsId: numberOfMonthsId
    },{where: {id: id}}).then(data => {
        res.status(200).send({status: 'success', data: data});
    }).catch(err => {
        res.status(500).send({status: 'error', message: err.message});
    });
};
exports.deleteMultipleIssueances = (req, res) => {
    const id = req.params.id;
    if(!id){
        return res.status(400).send({status: 'error', message: 'Missing parameter: id'}); 
    }
    models.multipleIssueances.destroy({where: {id: id}}).then(data => {
        res.status(200).send({status: 'success', data: data});
    }).catch(err => {
        res.status(500).send({status: 'error', message: err.message});
    });
};

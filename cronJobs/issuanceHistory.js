
const cron = require('node-cron')

const models = require('../models/index');

module.exports = cron.schedule('* * 1 * *', function () {
    console.log("HIHIIHIIHIHIHIHIIHIHIHIHIHIHIHIHH")
    models.issuancehistory
        .findAll()
        .then((data) => {
            console.log(data)
            data.map((item, index) => {
                models.issuancehistory.update({
                    Balance: 0,

                }, {
                    where: {
                        id: item.id
                    }
                }).then(data => {
                    console.log(data)
                })
                    .catch(err => {
                        console.log(err)
                    })
            })
        }).catch(err => {
            console.log("hehe phat gaya ")
        })
});
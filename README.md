# Nodejs Express Mysql Sequelize NORSA Backend

Database - MySQL (Setup local or test instance for development use, setup in AWS RDS for prod)
Framework - nodejs (express, pm2) - Run with pm2 to manage uptime/restarts/long term deploys

## Getting Setup
Setup nodejs and mysql.

## Requirements
* [NodeJs](https://nodejs.org) >= 8.x 
* [Mysql](https://www.mysql.com/) >= 8.x

## Install

```sh
$ git clone https://github.com/neat-soft/node-express-mysql-sequelize.git
$ npm install
$ sudo npm install -g pm2
$ sudo pm2 start pm2.json
```
## Run
```sh
$ npm start
```
| path                                                                               | methods.0 | middlewares.0    | middlewares.1 |
| ---------------------------------------------------------------------------------- | --------- | ---------------- | ------------- |
| *                                                                                  | OPTIONS   | corsMiddleware   |               |
| /api/public/clients/upsertClient                                                   | POST      | anonymous        |               |
| /api/public/clients/getActiveClientList                                            | GET       | anonymous        |               |
| /api/public/clients/getNextK_Id                                                    | GET       | anonymous        |               |
| /api/public/clients/getNextNK_Id                                                   | GET       | anonymous        |               |
| /api/auth/signup                                                                   | POST      | anonymous        |               |
| /api/auth/login                                                                    | POST      | anonymous        |               |
| /api/auth/logout                                                                   | GET       | anonymous        |               |
| /api/auth/verification-email                                                       | POST      | anonymous        |               |
| /api/auth/confirm-email                                                            | GET       | anonymous        |               |
| /api/auth/forgot-password                                                          | POST      | anonymous        |               |
| /api/auth/reset-password                                                           | POST      | anonymous        |               |
| /api/auth/change-password                                                          | POST      | anonymous        |               |
| /api/auth/validate-reset-password                                                  | POST      | anonymous        |               |
| /api/auth/getMerchantIdForLoggedInUser/:id                                         | GET       | anonymous        |               |
| /api/auth/refresh-session                                                          | POST      | anonymous        |               |
| /api/user/getAllUsers                                                              | GET       | anonymous        |               |
| /api/user/delete/:id                                                               | DELETE    | anonymous        |               |
| /api/user/update/:id                                                               | POST      | anonymous        |               |
| /api/user/getUserById/:id                                                          | GET       | anonymous        |               |
| /api/user/getUserByEmail/:email                                                    | GET       | anonymous        |               |
| /api/user/setUserRole/:id                                                          | POST      | anonymous        |               |
| /api/clients/getAllClients/:limit&:offset                                          | GET       | anonymous        |               |
| /api/clients/getAllClients                                                         | GET       | anonymous        |               |
| /api/clients/getAllClientsByDealer/:Dealer_id                                      | GET       | anonymous        |               |
| /api/clients/getNextD_Id                                                           | GET       | anonymous        |               |
| /api/clients/getAllActiveClients                                                   | GET       | anonymous        |               |
| /api/clients/getClientById/:id                                                     | GET       | anonymous        |               |
| /api/clients/createClient                                                          | POST      | anonymous        |               |
| /api/clients/upsertClient                                                          | POST      | anonymous        |               |
| /api/clients/deleteClient/:id                                                      | DELETE    | anonymous        |               |
| /api/clientProfilePicture/getImageById/:id                                         | GET       | anonymous        |               |
| /api/clientProfilePicture/getImageByClientId/:id                                   | GET       | anonymous        |               |
| /api/clientProfilePicture/createImage                                              | POST      | multerMiddleware | anonymous     |
| /api/clientProfilePicture/delete/:Client_id                                        | DELETE    | anonymous        |               |
| /api/public/clientProfilePicture/createImage                                       | POST      | multerMiddleware | anonymous     |
| /api/merchants/getAllMerchants/:limit&:offset                                      | GET       | anonymous        |               |
| /api/merchants/getAllMerchants                                                     | GET       | anonymous        |               |
| /api/merchants/getMerchantById/:id                                                 | GET       | anonymous        |               |
| /api/merchants/createMerchant                                                      | POST      | anonymous        |               |
| /api/merchants/upsertMerchant                                                      | POST      | anonymous        |               |
| /api/merchants/deleteMerchant/:id                                                  | DELETE    | anonymous        |               |
| /api/merchants/getAllMerchantTypes/:limit&:offset                                  | GET       | anonymous        |               |
| /api/merchants/getAllMerchantTypes                                                 | GET       | anonymous        |               |
| /api/merchants/getMerchantTypeById/:id                                             | GET       | anonymous        |               |
| /api/merchants/createMerchantType                                                  | POST      | anonymous        |               |
| /api/merchants/upsertMerchantType                                                  | POST      | anonymous        |               |
| /api/merchants/deleteMerchantType/:id                                              | DELETE    | anonymous        |               |
| /api/merchants/getAllMerchantTypeDiscounts/:limit&:offset                          | GET       | anonymous        |               |
| /api/merchants/getAllMerchantTypeDiscounts                                         | GET       | anonymous        |               |
| /api/merchants/getMerchantTypeDiscountByMerchantType_id/:MerchantType_id           | GET       | anonymous        |               |
| /api/merchants/getMerchantTypeDiscountById/:id                                     | GET       | anonymous        |               |
| /api/merchants/createMerchantTypeDiscount                                          | POST      | anonymous        |               |
| /api/merchants/upsertMerchantTypeDiscount                                          | POST      | anonymous        |               |
| /api/merchants/deleteMerchantTypeDiscount/:id                                      | DELETE    | anonymous        |               |
| /api/merchants/deleteMerchantTypeDiscountByMerchantType_id/:id                     | DELETE    | anonymous        |               |
| /api/nfcCard/getAllNfcCards/:limit&:offset                                         | GET       | anonymous        |               |
| /api/nfcCard/getAllNfcCards                                                        | GET       | anonymous        |               |
| /api/nfcCard/getNfcCardById/:id                                                    | GET       | anonymous        |               |
| /api/nfcCard/createNfcCard                                                         | POST      | anonymous        |               |
| /api/nfcCard/upsertNfcCard                                                         | POST      | anonymous        |               |
| /api/nfcCard/deleteNfcCard/:id                                                     | DELETE    | anonymous        |               |
| /api/dealers/getAlldealers/:limit&:offset                                          | GET       | anonymous        |               |
| /api/dealers/getAlldealers                                                         | GET       | anonymous        |               |
| /api/dealers/getDealerById/:id                                                     | GET       | anonymous        |               |
| /api/dealers/createDealer                                                          | POST      | anonymous        |               |
| /api/dealers/upsertDealer                                                          | POST      | anonymous        |               |
| /api/dealers/deleteDealer/:id                                                      | DELETE    | anonymous        |               |
| /api/device/getAllDevices                                                          | GET       | anonymous        |               |
| /api/device/getAllDevices/:limit&:offset                                           | GET       | anonymous        |               |
| /api/device/getDeviceById/:id                                                      | GET       | anonymous        |               |
| /api/device/createDevice                                                           | POST      | anonymous        |               |
| /api/device/upsertDevice                                                           | POST      | anonymous        |               |
| /api/device/deleteDevice/:id                                                       | DELETE    | anonymous        |               |
| /api/issuancehistory/getAllIssuancehistories/:limit&:offset                        | GET       | anonymous        |               |
| /api/issuancehistory/getAllIssuancehistories                                       | GET       | anonymous        |               |
| /api/issuancehistory/getAllIssuancehistoriesByAmountPaid                           | GET       | anonymous        |               |
| /api/issuancehistory/getIssuancehistoryById/:id                                    | GET       | anonymous        |               |
| /api/issuancehistory/getIssueanceHistyByClientId/:Client_id                        | GET       | anonymous        |               |
| /api/issuancehistory/getIssuanceHistoryByClientId/:Client_id                       | GET       | anonymous        |               |
| /api/issuancehistory/getissuancehistoryByPincodeAndNfcCard_id/:Pincode&:NfcCard_id | GET       | anonymous        |               |
| /api/issuancehistory/createIssuancehistory                                         | POST      | anonymous        |               |
| /api/issuancehistory/upsertIssuancehistory                                         | POST      | anonymous        |               |
| /api/issuancehistory/getClientByNfcAndPinCode                                      | POST      | anonymous        |               |
| /api/issuancehistory/deleteIssuancehistory/:id                                     | DELETE    | anonymous        |               |
| /api/userAccess/checkAdminStatus                                                   | POST      | anonymous        |               |
| /api/userAccess/changeUserStatus                                                   | POST      | anonymous        |               |
| /api/userAccess/dormantUser                                                        | POST      | anonymous        |               |
| /api/group/getAllGroups                                                            | GET       | anonymous        |               |
| /api/group/getGroupByClientId/:id                                                  | GET       | anonymous        |               |
| /api/group/getGroupById/:id                                                        | GET       | anonymous        |               |
| /api/group/createGroup                                                             | POST      | anonymous        |               |
| /api/group/upsertGroup                                                             | POST      | anonymous        |               |
| /api/group/deleteGroup/:id                                                         | DELETE    | anonymous        |               |
| /api/css/add                                                                       | POST      | multerMiddleware | anonymous     |
| /api/css/getFilesByClientId/:id                                                    | GET       | anonymous        |               |
| /api/css/delete/:Client_id                                                         | DELETE    | anonymous        |               |
| /api/cbs/add                                                                       | POST      | multerMiddleware | anonymous     |
| /api/cbs/getFilesByClientId/:id                                                    | GET       | anonymous        |               |
| /api/cbs/delete/:Client_id                                                         | DELETE    | anonymous        |               |
| /api/multipleIssueances/getAllByIssuancesId/:issuancesId                           | GET       | anonymous        |               |
| /api/multipleIssueances/getAllByMerchantId/:merchantId                             | GET       | anonymous        |               |
| /api/multipleIssueances/createMultipleIssueances                                   | POST      | anonymous        |               |
| /api/multipleIssueances/updateMultipleIssueances                                   | PUT       | anonymous        |               |
| /api/multipleIssueances/deleteMultipleIssueances/:id                               | DELETE    | anonymous        |               |
| /api/transactionHistory/getAllTransactionHistory/:limit&:offset                    | GET       | anonymous        |               |
| /api/transactionHistory/getTransactionHistoryById/:id                              | GET       | anonymous        |               |
| /api/transactionHistory/searchTransactions                                         | GET       | anonymous        |               | (use this for searching)
| /api/transactionHistory/createTransactionHistory                                   | POST      | anonymous        |               |
| /api/transactionHistory/bulkCreateTransectionHistory                               | POST      | anonymous        |               |
| /api/transactionHistory/deleteTransectionById/:id                                  | DELETE    | anonymous        |               |
| /api/transactionHistory/updateTransection/:id                                      | PUT       | anonymous        |               |
| /api/transactionHistory/getTodaysTransactions                                      | GET       | anonymous        |               |
| /api/paybackPeriod/createPaybackPeriod {date, issuanceHistory_Id,ammount,status}         | Post       | anonymous        |               |
| /api/paybackPeriod/getPaybackPeriodById/:id                                              | get       | anonymous        |               |
| /api/paybackPeriod//getPaybackPeriodByIssuanceHistory/:issuanceHistory_Id          | get       | anonymous        |               |
| /api/paybackPeriod/getPaybackPeriods                                                   | get       | anonymous        |               |
| /api/paybackPeriod/updatePaybackPeriod {Date,issuanceHistory_Id,ammount,status,id}       | put       | anonymous        |               |
| /api/paybackPeriod/deletePaybackPeriod/:id                                               | delete       | anonymous        |               |


## searchTransactions
{{ApiEndpoint}}/transactionHistory/searchTransactions
the correct response should be like this and further changes will be made with the query string where condition
```sh
{
    "message": "success",
    "data": [
        {
            "id": "1",
            "ItemDescription": "",
            "dateTime": null,
            "AmountUser": null,
            "client_Id": "D-285",
            "FirstName": "Lucille",
            "LastName": "Ricardo",
            "merchant_Id": "prefix-962",
            "Name": "Multi-Tronics",
            "Merchant_Email": ""
        }
    ]
}
```
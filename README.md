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

│ (index) │                                         path                                         │    methods    │             middlewares             │
├─────────┼──────────────────────────────────────────────────────────────────────────────────────┼───────────────┼─────────────────────────────────────┤
│    0    │                                         '*'                                          │ [ 'OPTIONS' ] │        [ 'corsMiddleware' ]         │
│    1    │                          '/api/public/clients/upsertClient'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│    2    │                      '/api/public/clients/getActiveClientList'                       │   [ 'GET' ]   │           [ 'anonymous' ]           │
│    3    │                          '/api/public/clients/getNextK_Id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│    4    │                          '/api/public/clients/getNextNK_Id'                          │   [ 'GET' ]   │           [ 'anonymous' ]           │
│    5    │                                  '/api/auth/signup'                                  │  [ 'POST' ]   │           [ 'anonymous' ]           │
│    6    │                                  '/api/auth/login'                                   │  [ 'POST' ]   │           [ 'anonymous' ]           │
│    7    │                                  '/api/auth/logout'                                  │   [ 'GET' ]   │           [ 'anonymous' ]           │
│    8    │                            '/api/auth/verification-email'                            │  [ 'POST' ]   │           [ 'anonymous' ]           │
│    9    │                              '/api/auth/confirm-email'                               │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   10    │                             '/api/auth/forgot-password'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   11    │                              '/api/auth/reset-password'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   12    │                             '/api/auth/change-password'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   13    │                         '/api/auth/validate-reset-password'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   14    │                             '/api/auth/refresh-session'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   15    │                               '/api/user/getAllUsers'                                │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   16    │                                '/api/user/delete/:id'                                │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   17    │                                '/api/user/update/:id'                                │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   18    │                             '/api/user/getUserById/:id'                              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   19    │                          '/api/user/getUserByEmail/:email'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   20    │                             '/api/user/setUserRole/:id'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   21    │                     '/api/clients/getAllClients/:limit&:offset'                      │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   22    │                             '/api/clients/getAllClients'                             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   23    │                   '/api/clients/getAllClientsByDealer/:Dealer_id'                    │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   24    │                              '/api/clients/getNextD_Id'                              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   25    │                          '/api/clients/getAllActiveClients'                          │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   26    │                           '/api/clients/getClientById/:id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   27    │                             '/api/clients/createClient'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   28    │                             '/api/clients/upsertClient'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   29    │                           '/api/clients/deleteClient/:id'                            │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   30    │                     '/api/clientProfilePicture/getImageById/:id'                     │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   31    │                  '/api/clientProfilePicture/getImageByClientId/:id'                  │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   32    │                       '/api/clientProfilePicture/createImage'                        │  [ 'POST' ]   │ [ 'multerMiddleware', 'anonymous' ] │
│   33    │                    '/api/clientProfilePicture/delete/:Client_id'                     │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   34    │                    '/api/public/clientProfilePicture/createImage'                    │  [ 'POST' ]   │ [ 'multerMiddleware', 'anonymous' ] │
│   35    │                   '/api/merchants/getAllMerchants/:limit&:offset'                    │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   36    │                           '/api/merchants/getAllMerchants'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   37    │                         '/api/merchants/getMerchantById/:id'                         │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   38    │                           '/api/merchants/createMerchant'                            │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   39    │                           '/api/merchants/upsertMerchant'                            │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   40    │                         '/api/merchants/deleteMerchant/:id'                          │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   41    │                 '/api/merchants/getAllMerchantTypes/:limit&:offset'                  │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   42    │                         '/api/merchants/getAllMerchantTypes'                         │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   43    │                       '/api/merchants/getMerchantTypeById/:id'                       │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   44    │                         '/api/merchants/createMerchantType'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   45    │                         '/api/merchants/upsertMerchantType'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   46    │                       '/api/merchants/deleteMerchantType/:id'                        │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   47    │             '/api/merchants/getAllMerchantTypeDiscounts/:limit&:offset'              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   48    │                     '/api/merchants/getAllMerchantTypeDiscounts'                     │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   49    │      '/api/merchants/getMerchantTypeDiscountByMerchantType_id/:MerchantType_id'      │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   50    │                   '/api/merchants/getMerchantTypeDiscountById/:id'                   │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   51    │                     '/api/merchants/createMerchantTypeDiscount'                      │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   52    │                     '/api/merchants/upsertMerchantTypeDiscount'                      │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   53    │                   '/api/merchants/deleteMerchantTypeDiscount/:id'                    │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   54    │           '/api/merchants/deleteMerchantTypeDiscountByMerchantType_id/:id'           │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   55    │                     '/api/nfcCard/getAllNfcCards/:limit&:offset'                     │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   56    │                            '/api/nfcCard/getAllNfcCards'                             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   57    │                          '/api/nfcCard/getNfcCardById/:id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   58    │                             '/api/nfcCard/createNfcCard'                             │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   59    │                             '/api/nfcCard/upsertNfcCard'                             │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   60    │                           '/api/nfcCard/deleteNfcCard/:id'                           │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   61    │                     '/api/dealers/getAlldealers/:limit&:offset'                      │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   62    │                             '/api/dealers/getAlldealers'                             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   63    │                           '/api/dealers/getDealerById/:id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   64    │                             '/api/dealers/createDealer'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   65    │                             '/api/dealers/upsertDealer'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   66    │                           '/api/dealers/deleteDealer/:id'                            │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   67    │                             '/api/device/getAllDevices'                              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   68    │                      '/api/device/getAllDevices/:limit&:offset'                      │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   69    │                           '/api/device/getDeviceById/:id'                            │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   70    │                              '/api/device/createDevice'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   71    │                              '/api/device/upsertDevice'                              │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   72    │                            '/api/device/deleteDevice/:id'                            │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   73    │            '/api/issuancehistory/getAllIssuancehistories/:limit&:offset'             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   74    │                    '/api/issuancehistory/getAllIssuancehistories'                    │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   75    │              '/api/issuancehistory/getAllIssuancehistoriesByAmountPaid'              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   76    │                  '/api/issuancehistory/getIssuancehistoryById/:id'                   │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   77    │            '/api/issuancehistory/getIssueanceHistyByClientId/:Client_id'             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   78    │            '/api/issuancehistory/getIssuanceHistoryByClientId/:Client_id'            │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   79    │ '/api/issuancehistory/getissuancehistoryByPincodeAndNfcCard_id/:Pincode&:NfcCard_id' │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   80    │                     '/api/issuancehistory/createIssuancehistory'                     │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   81    │                     '/api/issuancehistory/upsertIssuancehistory'                     │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   82    │                   '/api/issuancehistory/getClientByNfcAndPinCode'                    │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   83    │                   '/api/issuancehistory/deleteIssuancehistory/:id'                   │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   84    │                          '/api/userAccess/checkAdminStatus'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   85    │                          '/api/userAccess/changeUserStatus'                          │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   86    │                            '/api/userAccess/dormantUser'                             │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   87    │                              '/api/group/getAllGroups'                               │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   88    │                         '/api/group/getGroupByClientId/:id'                          │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   89    │                            '/api/group/getGroupById/:id'                             │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   90    │                               '/api/group/createGroup'                               │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   91    │                               '/api/group/upsertGroup'                               │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   92    │                             '/api/group/deleteGroup/:id'                             │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   93    │                                    '/api/css/add'                                    │  [ 'POST' ]   │ [ 'multerMiddleware', 'anonymous' ] │
│   94    │                          '/api/css/getFilesByClientId/:id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   95    │                             '/api/css/delete/:Client_id'                             │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   96    │                                    '/api/cbs/add'                                    │  [ 'POST' ]   │ [ 'multerMiddleware', 'anonymous' ] │
│   97    │                          '/api/cbs/getFilesByClientId/:id'                           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   98    │                             '/api/cbs/delete/:Client_id'                             │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   99    │              '/api/multipleIssueances/getAllByIssuancesId/:issuancesId'              │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   100   │               '/api/multipleIssueances/getAllByMerchantId/:merchantId'               │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   101   │                  '/api/multipleIssueances/createMultipleIssueances'                  │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   102   │                  '/api/multipleIssueances/updateMultipleIssueances'                  │   [ 'PUT' ]   │           [ 'anonymous' ]           │
│   103   │                '/api/multipleIssueances/deleteMultipleIssueances/:id'                │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   104   │          '/api/transactionHistory/getAllTransactionHistory/:limit&:offset'           │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   105   │               '/api/transactionHistory/getTransactionHistoryById/:id'                │   [ 'GET' ]   │           [ 'anonymous' ]           │
│   106   │                  '/api/transactionHistory/createTransactionHistory'                  │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   107   │                '/api/transactionHistory/bulkCreateTransectionHistory'                │  [ 'POST' ]   │           [ 'anonymous' ]           │
│   108   │                 '/api/transactionHistory/deleteTransectionById/:id'                  │ [ 'DELETE' ]  │           [ 'anonymous' ]           │
│   109   │                   '/api/transactionHistory/updateTransection/:id'                    │   [ 'PUT' ]   │           [ 'anonymous' ]           │
└─────────┴──────────────────────────────────────────────────────────────────────────────────────┴───────────────┴─────────────────────────────────────┘
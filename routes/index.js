const authRouter = require('./auth');
const clientsRouter = require('./clients');
const clientPictureRouter = require('./clientProfilePicture')
const publicClientPictureRouter = require('./publicClientProfilePicture')
const userRouter = require('./user')
const publicClientsRouter = require('./publicClient')

const merchantsRouter = require('./merchants');
const dealerRouter = require('./dealer');
const deviceRouter = require('./device');
const issuancehistoryRouter = require('./issuancehistory');
const userAccessRouter = require('./userAccess');
const nfcCardRouter = require('./nfcCard');
const groupRouter = require('./group');
const cslRouter = require('./clientSalarySlip')
const cbsRouter = require('./clientBankStatement')
const multipleIssueances = require('./multipleIssueances');
const transectionHistoryRouter = require('./transectionHistory');

module.exports = function (app) {

  app.use('/api/public/clients', publicClientsRouter)
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/clients', clientsRouter);
  app.use('/api/clientProfilePicture', clientPictureRouter)
  app.use('/api/public/clientProfilePicture', publicClientPictureRouter)
  app.use('/api/merchants', merchantsRouter);
  app.use('/api/nfcCard', nfcCardRouter);
  app.use('/api/dealers', dealerRouter);
  app.use('/api/device', deviceRouter);
  app.use('/api/issuancehistory', issuancehistoryRouter);
  app.use('/api/userAccess', userAccessRouter);
  app.use('/api/group', groupRouter);
  app.use('/api/css', cslRouter);
  app.use('/api/cbs', cbsRouter);
  app.use('/api/multipleIssueances', multipleIssueances);
  app.use('/api/transactionHistory', transectionHistoryRouter);
  app.use('/api/paybackPeriod', require('./paybackPeriod'));
};

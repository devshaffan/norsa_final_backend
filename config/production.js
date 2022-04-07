const config = {
  app: {
    port: process.env.PORT || 3000,
    project: 'node-express-mysql-sequelize-demo-app',
    url: 'http://localhost:3000/api',
    secret: 'asdfasfasdfasdafsdf231243243234234234234234234234',
  },
  db: {
    host: 'us-mm-dca-8017d620b68c.g5.cleardb.net',
    database: 'heroku_801d0b2546249bf',
    username: 'b24efc896a4412',
    password: 'ea7e2fa7',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  sendgrid: {
    apiKey: ''
  }
}
module.exports = config;
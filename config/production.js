const config = {
    app: {
      port: process.env.PORT || 3000,
      project: 'node-express-mysql-sequelize-demo-app',
      url: 'http://localhost:3000/api',
      secret: 'asdfasfasdfasdafsdf231243243234234234234234234234',
    },
    db: {
      host: 'sql213.epizy.com',
      database: 'epiz_30611894_rippleberry',
      username: 'epiz_30611894',
      password: 'j8XGa8eWa5',
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
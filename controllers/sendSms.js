const accountSid = process.env.TWILIO_ACCOUNT_SID || "AC47abefd843703444c18e3f376126b164";
const authToken = process.env.TWILIO_AUTH_TOKEN || "854aa8b534d17f9e9ff316e274aa4bea";
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({body: 'Hi there', from: '+15017122661', to: '+15558675310'})
      .then(message => console.log(message.sid));
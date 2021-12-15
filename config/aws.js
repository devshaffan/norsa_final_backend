const aws = require('aws-sdk')
aws.config.setPromisesDependency();
aws.config.update({
    accessKeyId: process.env.ACCESSKEYID || "AKIAXMBJUUOCAWS3ZDWQ",
    secretAccessKey: process.env.SECRETACCESSKEY || "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",
    region: process.env.REGION || "eu-central-1"
});

const s3 = new aws.S3();
module.exports = s3
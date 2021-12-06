const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const config = require('../config/config');

const { bucketName, region, accessKeyId, secretAccessKey } = config.S3;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFile = (file, type, format) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${type}/${file.filename}${format}`,
    ContentDisposition: 'inline',
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};

module.exports = {
  uploadFile,
};

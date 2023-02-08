const { Credentials } = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const s3Config = new S3({
  region: process.env.AWS_S3_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: new Credentials({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  }),
});

const avatarS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'profiles/' +
        file.fieldname +
        '_' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

exports.uploadAvatar = multer({
  storage: avatarS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.deleteFile = async (fileuri) => {
  const fileKey = fileuri.split('/').slice(-2).join('/');
  return await s3Config
    .deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    })
    .promise();
};

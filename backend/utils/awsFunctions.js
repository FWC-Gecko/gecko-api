const { Credentials } = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const s3Config = new S3({
  region: process.env.LINODE_OBJECT_STORAGE_REGION,
  endpoint: process.env.LINODE_OBJECT_STORAGE_ENDPOINT,
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: new Credentials({
    accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY,
  }),
});

const avatarS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
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

const storyAudioS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'story_audios/' +
        file.fieldname +
        '_' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const songS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'songs/' +
        file.fieldname +
        '_' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const applicantMusicS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'applicant_music/' +
        file.fieldname +
        '_' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const disaNumberS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'disanumber/' +
        file.fieldname +
        '_' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const promoVideoS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      'promo_video/' +
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

exports.uploadStoryAudio = multer({
  storage: storyAudioS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.uploadSong = multer({
  storage: songS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.uploadApplicantMusic = multer({
  storage: applicantMusicS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.uploadDisaNumber = multer({
  storage: disaNumberS3Config,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

exports.uploadPromoVideo = multer({
  storage: promoVideoS3Config,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

exports.deleteFile = async (fileuri) => {
  const fileKey = fileuri.split('/').slice(-2).join('/');
  return await s3Config
    .deleteObject({
      Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
      Key: fileKey,
    })
    .promise();
};

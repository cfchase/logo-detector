const env = require("env-var");
const S3Storage = require("./s3Storage");

const {S3_ENDPOINT, S3_BUCKET, S3_PREFIX, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY} = require("./constants");
const storage = new S3Storage(S3_ENDPOINT, S3_BUCKET, S3_PREFIX, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY);

module.exports = storage;

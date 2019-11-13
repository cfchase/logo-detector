const env = require("env-var");

const PORT = env.get("PORT", "8080").asIntPositive();
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const LOG_LEVEL = env.get("LOG_LEVEL", "info").asString();
const INFERENCE_URL = env.get("INFERENCE_URL", "http://scavenger-inference:8080").asString();
const S3_ENDPOINT = env.get("S3_ENDPOINT").required().asString();
const S3_BUCKET = env.get("S3_BUCKET").required().asString();
const S3_PREFIX = env.get("S3_PREFIX").asString();
const S3_ACCESS_KEY_ID = env.get("S3_ACCESS_KEY_ID").required().asString();
const S3_SECRET_ACCESS_KEY = env.get("S3_SECRET_ACCESS_KEY").required().asString();

module.exports = {
  PORT,
  IP,
  LOG_LEVEL,
  INFERENCE_URL,
  S3_ENDPOINT,
  S3_BUCKET,
  S3_PREFIX,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY
};
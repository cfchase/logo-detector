const env = require("env-var");

const PORT = env.get("PORT", "8080").asIntPositive();
const IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const LOG_LEVEL = env.get("LOG_LEVEL", "info").asString();
const INFERENCE_URL = env.get("INFERENCE_URL", "http://logo-detector-inference:8080").asString();

module.exports = {
  PORT,
  IP,
  LOG_LEVEL,
  INFERENCE_URL
};
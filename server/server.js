'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const env = require("env-var");

const opts = {};
const port = env.get("PORT", "8080").asIntPositive();
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
const logLevel = env.get("LOG_LEVEL", "info").asString();

const fastify = require('fastify')({
  logger: {
    level:  logLevel
  }
});

//---------------------
// Fastify Plugins

//---------------------
// Custom Plugins
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
  options: Object.assign({}, opts)
});

//---------------------
// Decorators

//---------------------
// Hooks and Middlewares

//---------------------
// Services
fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'services'),
  options: Object.assign({}, opts)
});


fastify.listen(port, ip,function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
});
'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const env = require("env-var");

const opts = {};
const {PORT, IP, LOG_LEVEL} = require("./utils/constants");

const fastify = require('fastify')({
  logger: {
    level:  LOG_LEVEL
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


fastify.listen(PORT, IP, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
});
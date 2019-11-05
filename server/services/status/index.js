"use strict";

const env = require("env-var");
const axios = require("../../utils/axios");
const inferenceUrl = env.get("INFERENCE_URL", "http://scavenger-inference:8080").asString();

const opts = {
  schema: {
    body: {

    }
  }
};

module.exports = async function (fastify, opts) {
  fastify.get("/status", async function (request, reply) {
    const inferenceStatusUrl = new URL("/status", inferenceUrl).href;
    request.log.info("inferenceStatusUrl", inferenceStatusUrl);
    try {
      const inferenceResponse = await axios({
        // headers: {
        //   "content-type": "application/json",
        // },
        method: "GET",
        url: inferenceStatusUrl
      });

      let inferenceStatus = inferenceResponse.data;
      return {inferenceStatus};
    } catch (error) {
      request.log.error("error occurred in http call to inference API:");
      request.log.error(error);
      reply.code(500);
      return {"error": "oh no"}
    }
  })
};

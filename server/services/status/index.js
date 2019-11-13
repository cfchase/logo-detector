"use strict";

const axios = require("../../utils/axios");
const {INFERENCE_URL} = require("../../utils/constants");
const storage = require("../../utils/storage");

const opts = {
  schema: {
    body: {

    }
  }
};

module.exports = async function (fastify, opts) {
  fastify.get("/status", async function (request, reply) {
    const requestUrl = new URL("/status", INFERENCE_URL).href;
    request.log.info("inferenceStatusUrl", requestUrl);
    try {
      const inferenceResponse = await axios({
        method: "GET",
        url: requestUrl
      });

      let inferenceStatus = inferenceResponse.data;
      return {inferenceStatus, storage};
    } catch (error) {
      request.log.error("error occurred in http call to inference API:");
      request.log.error(error);
      reply.code(500);
      return {"error": "oh no"}
    }
  })
};

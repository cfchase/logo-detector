"use strict";

const _ = require("lodash");
const {INFERENCE_URL} = require("../../utils/constants");
const axios = require("../../utils/axios");

module.exports = async function (fastify, opts) {
  fastify.post("/photos", async function (request, reply) {
    const photo = _.get(request, "body.photo");
    if (!photo) {
      reply.code(422);
      return {
        status: "error",
        message: "Missing Fields: photo",
      };
    }

    const base64data = photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    let inferenceResponse;
    try {
      inferenceResponse = await getLogos(base64data);
    } catch (error) {
      request.log.error("error occurred generating inference", error.message);
      // request.log.debug(error.stack);
      return error
    }

    const inference = inferenceResponse.data;
    reply.code(201);
    return {photo, inference};
  });
};

function getLogos(image) {
  const requestUrl = new URL("/logos", INFERENCE_URL).href;
  return  axios({
    method: "POST",
    url: requestUrl,
    data: {image}
  });
}

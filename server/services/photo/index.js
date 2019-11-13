"use strict";

const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");

const {INFERENCE_URL} = require("../../utils/constants");
const axios = require("../../utils/axios");
const storage = require("../../utils/storage");

const photoPrefix = "photos";

module.exports = async function (fastify, opts) {
  fastify.post("/photo", async function (request, reply) {
    try {
      const strData = _.get(request, "body.photo");
      if (!strData) {
        reply.code(422);
        return {
          status: "error",
          message: "Missing Fields: photo",
        };
      }

      const base64data = strData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
      const buff = Buffer.from(base64data, 'base64');
      const file = await writeJpg(buff);
      const inferenceResponse = await getInference(file);
      const inference = inferenceResponse.data;
      reply.code(201);
      return {file, inference};
    } catch (error) {
      request.log.error("error occurred writing photo");
      request.log.error(error);
    }
  });
};

async function writeJpg(data, request) {
  const photoId = generateFilename();
  try {
    const response = await storage.writeFile(data, photoId);
    return photoId;
  } catch (error) {
    request.log.error(`Failure to write ${photoId} to storage`);
    throw error;
  }
}

function getInference(file) {
  const requestUrl = new URL("/inference", INFERENCE_URL).href;
  return  axios({
    method: "POST",
    url: requestUrl,
    data: {
      file
    }
  });
}

function generateFilename() {
  const date = moment().format('YYYYMMDD-HH:mm:ss:SSS');
  const random = Math.random().toString(36).slice(-5);
  return `${photoPrefix}/${date}-${random}.jpg`;
}
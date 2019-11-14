"use strict";

const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");

const {INFERENCE_URL} = require("../../utils/constants");
const axios = require("../../utils/axios");
const storage = require("../../utils/storage");

const photoPrefix = "photos";

module.exports = async function (fastify, opts) {
  fastify.post("/files", async function (request, reply) {
    try {
      const strData = _.get(request, "body.file");

      const base64data = strData.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
      const buff = Buffer.from(base64data, 'base64');
      const file = await writeFile(buff, request);
      const inferenceResponse = await getInference(file);
      const inference = inferenceResponse.data;
      reply.code(201);
      return {file, inference};
    } catch (error) {
      request.log.error("error occurred writing photo");
      request.log.error(error);
      reply.code(500);
      return {error};
    }
  });
};

async function writeFile(data, request) {
  return new Promise((resolve, reject) => {
    const fileName = generateFilename();
    fs.writeFile(fileName, data, error => {
      if (error) {
        reject(error)
      }

      resolve(fileName);
    });
  });
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
  return `/tmp/${date}-${random}.jpg`;
}
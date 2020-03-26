#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-logo-detector}
IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-server:latest}
REPLICAS=${SERVER_REPLICAS:-2}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/server.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  -p OPENMM_HOST=${OPENMM_HOST} \
  -p OPENMM_USER=${OPENMM_USER} \
  -p OPENMM_PASSWORD=${OPENMM_PASSWORD} \
  | oc create -f -

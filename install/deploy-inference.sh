#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}
IMAGE_REPOSITORY=${INFERENCE_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-inference:latest}
REPLICAS=${INFERENCE_REPLICAS:-1}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/inference.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  | oc create -f -

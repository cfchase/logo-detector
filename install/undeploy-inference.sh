#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}
IMAGE_REPOSITORY=${INFERENCE_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-inference:latest}

oc project ${PROJECT}
echo "Undeploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/inference.yml | oc delete -f -

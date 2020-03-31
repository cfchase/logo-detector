#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-logo-detector}
IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-server:latest}

oc project ${PROJECT}
echo "Undeploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/server.yml" \
  -p OPENMM_HOST=dontcare \
  -p OPENMM_USER=dontcare \
  -p OPENMM_PASSWORD=dontcare \
  | oc delete -f -

#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-logo-detector}
ROUTE_NAME=${ROUTE_NAME:-snapshot}
IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-ui:latest}
REPLICAS=${UI_REPLICAS:-2}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f "${DIR}/ui.yml" \
  -p IMAGE_REPOSITORY=${IMAGE_REPOSITORY} \
  -p REPLICAS=${REPLICAS} \
  -p ROUTE_NAME=${ROUTE_NAME} \
  -p KEY="${KEY}" \
  -p CERTIFICATE="${CERTIFICATE}" \
  -p CA_CERTIFICATE="${CA_CERTIFICATE}" \
  | oc create -f -

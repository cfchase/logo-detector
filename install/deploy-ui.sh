#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}
ROUTE_NAME=${ROUTE_NAME:-game}
IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-ui:latest}
REPLICAS=${UI_REPLICAS:-1}

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

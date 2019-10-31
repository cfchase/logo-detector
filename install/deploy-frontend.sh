#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}
UI_IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-ui:latest}
UI_REPLICAS=${UI_REPLICAS:-1}

oc project ${PROJECT}
echo "Deploying ${UI_IMAGE_REPOSITORY}"

oc process -f "${DIR}/ui.yml" \
  -p IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY} \
  -p REPLICAS=${UI_REPLICAS} \
  | oc create -f -

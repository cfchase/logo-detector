#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-logo-detector}
UI_IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-ui:latest}

oc project ${PROJECT}
echo "Deploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/ui.yml | oc delete -f -

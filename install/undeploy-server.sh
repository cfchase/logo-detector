#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}
SERVER_IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-server:latest}

oc project ${PROJECT}
echo "Undeploying ${IMAGE_REPOSITORY}"

oc process -f ${DIR}/server.yml | oc delete -f -

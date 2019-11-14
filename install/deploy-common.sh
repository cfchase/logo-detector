#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}

oc project ${PROJECT}
echo "Deploying Common Objects"

oc process -f "${DIR}/common.yml" \
  -p S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID} \
  -p S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY} \
  -p S3_ENDPOINT=${S3_ENDPOINT} \
  -p S3_BUCKET=${S3_BUCKET} \
  -p S3_REGION=${S3_REGION} \
  -p S3_PREFIX=${S3_PREFIX} \
  | oc create -f -

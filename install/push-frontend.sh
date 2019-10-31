#!/usr/bin/env bash
#set -x

UI_IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-ui:latest}

echo "Pushing ${UI_IMAGE_REPOSITORY}"
docker push ${UI_IMAGE_REPOSITORY}




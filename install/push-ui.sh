#!/usr/bin/env bash

IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-ui:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}




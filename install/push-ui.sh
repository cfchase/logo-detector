#!/usr/bin/env bash

IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-ui:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}




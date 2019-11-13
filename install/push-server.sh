#!/usr/bin/env bash

IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-server:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}

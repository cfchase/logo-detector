#!/usr/bin/env bash
#set -x

SERVER_IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-server:latest}

echo "Pushing ${SERVER_IMAGE_REPOSITORY}"
docker push ${SERVER_IMAGE_REPOSITORY}

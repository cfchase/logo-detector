#!/usr/bin/env bash

IMAGE_REPOSITORY=${INFERENCE_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-inference:latest}

echo "Pushing ${IMAGE_REPOSITORY}"
docker push ${IMAGE_REPOSITORY}

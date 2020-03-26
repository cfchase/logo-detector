#!/bin/bash

IMAGE_REPOSITORY=${SERVER_IMAGE_REPOSITORY:-quay.io/cfchase/logo-detector-server:latest}
SOURCE_REPOSITORY_URL=${SOURCE_REPOSITORY_URL:-https://github.com/cfchase/logo-detector.git}
SOURCE_REPOSITORY_REF=${SOURCE_REPOSITORY_REF:-master}

echo "Building ${SERVER_IMAGE_REPOSITORY} from ${SOURCE_REPOSITORY_URL} on ${SOURCE_REPOSITORY_REF}"

s2i build ${SOURCE_REPOSITORY_URL} --ref ${SOURCE_REPOSITORY_REF} --context-dir /server docker.io/centos/python-36-centos7:latest ${IMAGE_REPOSITORY}

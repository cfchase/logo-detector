#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

IMAGE_REPOSITORY=${UI_IMAGE_REPOSITORY:-quay.io/cfchase/scavenger-ui:latest}
SOURCE_REPOSITORY_URL=${SOURCE_REPOSITORY_URL:-https://github.com/cfchase/scavenger.git}
SOURCE_REPOSITORY_REF=${SOURCE_REPOSITORY_REF:-master}

echo "Building ${UI_IMAGE_REPOSITORY} from ${SOURCE_REPOSITORY_URL} on ${SOURCE_REPOSITORY_REF}"

cd ${DIR}/../ui
rm -rf build
yarn install
yarn build

s2i build ./build centos/nginx-114-centos7 ${IMAGE_REPOSITORY}

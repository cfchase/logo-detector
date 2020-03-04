#!/usr/bin/env bash

LOGO_DETECTION_HOST=${LOGO_DETECTION_HOST:-http://localhost:8081}

IMG=$(base64 -w 0 "$1")
DATA="{\"image\": \"${IMG}\"}"

curl --location --request POST "${LOGO_DETECTION_HOST}/logos" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw "${DATA}"


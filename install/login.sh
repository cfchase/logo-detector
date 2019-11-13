#!/bin/bash

OC=${OC:-"/usr/bin"}
PROJECT=${PROJECT:-scavenger}

if [ -n "${OC_SKIP_TLS_VERIFY}" ]; then
  OC_SKIP_TLS_VERIFY_STR=--insecure-skip-tls-verify=true
fi

if [ -n "${OC_TOKEN}" ]; then
  CMD="${OC} login --server=${OC_URL} --token=${OC_TOKEN} ${OC_SKIP_TLS_VERIFY_STR} && ${OC} project ${PROJECT} 2> /dev/null || oc new-project ${PROJECT}"
else
  CMD="${OC} login --server=${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} ${OC_SKIP_TLS_VERIFY_STR} && ${OC} project ${PROJECT} 2> /dev/null || oc new-project ${PROJECT}"
fi

eval $CMD

#!/bin/bash
#set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

PROJECT=${PROJECT:-scavenger}

oc project ${PROJECT}
echo "Undeploying Common Objects"

oc process -f ${DIR}/common.yml | oc delete -f -

#!/usr/bin/env bash

echo "Rolling out new version of scavenger-ui"
oc rollout latest dc/scavenger-ui

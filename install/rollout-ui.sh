#!/usr/bin/env bash

echo "Rolling out new version of logo-detector-ui"
oc rollout latest dc/logo-detector-ui

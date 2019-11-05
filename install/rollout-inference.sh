#!/usr/bin/env bash

echo "Rolling out new version of scavenger-inference"
oc rollout latest dc/scavenger-inference

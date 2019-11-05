#!/usr/bin/env bash

echo "Rolling out new version of scavenger-server"
oc rollout latest dc/scavenger-server

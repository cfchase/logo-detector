#!/usr/bin/env bash

echo "Rolling out new version of logo-detector-server"
oc rollout latest dc/logo-detector-server

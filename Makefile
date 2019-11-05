ENV_FILE := .env
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

.DEFAULT_GOAL := build

.PHONY: oc-login
oc-login:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null || oc new-project ${PROJECT}

.PHONY: build-inference
build-inference:
	./install/build-inference.sh

.PHONY: build-server
build-server:
	./install/build-server.sh

.PHONY: build-ui
build-ui:
	./install/build-ui.sh

.PHONY: build
build: build-inference build-server build-ui

.PHONY: push-inference
push-inference:
	./install/push-inference.sh

.PHONY: push-server
push-server:
	./install/push-server.sh

.PHONY: push-ui
push-ui:
	./install/push-ui.sh

.PHONY: push
push: push-inference push-server push-ui

.PHONY: deploy-common
deploy-common: oc-login
	./install/deploy-common.sh

.PHONY: deploy-inference
deploy-inference: oc-login
	./install/deploy-inference.sh

.PHONY: deploy-server
deploy-server: oc-login
	./install/deploy-server.sh

.PHONY: deploy-ui
deploy-ui: oc-login
	./install/deploy-ui.sh

.PHONY: deploy
deploy: oc-login deploy-common deploy-inference deploy-server deploy-ui

.PHONY: rollout-inference
rollout-inference: oc-login
	./install/rollout-inference.sh

.PHONY: rollout-server
rollout-server: oc-login
	./install/rollout-server.sh

.PHONY: rollout-ui
rollout-ui: oc-login
	./install/rollout-ui.sh

.PHONY: rollout
rollout: oc-login rollout-inference rollout-server rollout-ui

.PHONY: undeploy-common
undeploy-common: oc-login
	./install/undeploy-common.sh

.PHONY: undeploy-inference
undeploy-inference: oc-login
	./install/undeploy-inference.sh

.PHONY: undeploy-server
undeploy-server: oc-login
	./install/undeploy-server.sh

.PHONY: undeploy-ui
undeploy-ui: oc-login
	./install/undeploy-ui.sh

.PHONY: undeploy
undeploy: oc-login undeploy-ui undeploy-server undeploy-inference undeploy-common

.PHONY: delete
delete:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null && oc delete project ${PROJECT}
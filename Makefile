ENV_FILE := .env
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

.DEFAULT_GOAL := build

.PHONY: login
login:
	./install/login.sh

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

.PHONY: deploy-inference
deploy-inference: login
	./install/deploy-inference.sh

.PHONY: deploy-server
deploy-server: login
	./install/deploy-server.sh

.PHONY: deploy-ui
deploy-ui: login
	./install/deploy-ui.sh

.PHONY: deploy
deploy: login deploy-inference deploy-server deploy-ui

.PHONY: rollout-inference
rollout-inference: login
	./install/rollout-inference.sh

.PHONY: rollout-server
rollout-server: login
	./install/rollout-server.sh

.PHONY: rollout-ui
rollout-ui: login
	./install/rollout-ui.sh

.PHONY: rollout
rollout: login rollout-inference rollout-server rollout-ui

.PHONY: undeploy-inference
undeploy-inference: login
	./install/undeploy-inference.sh

.PHONY: undeploy-server
undeploy-server: login
	./install/undeploy-server.sh

.PHONY: undeploy-ui
undeploy-ui: login
	./install/undeploy-ui.sh

.PHONY: undeploy
undeploy: login undeploy-ui undeploy-server undeploy-inference

.PHONY: delete
delete:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null && oc delete project ${PROJECT}
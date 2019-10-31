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

.PHONY: build-backend
build-backend:
	./install/build-backend.sh

.PHONY: build-frontend
build-frontend:
	./install/build-frontend.sh

.PHONY: build
build:
	./install/build-backend.sh && ./install/build-frontend.sh

.PHONY: push-backend
push-backend:
	./install/push-backend.sh

.PHONY: push-frontend
push-frontend:
	./install/push-frontend.sh

.PHONY: push
push:
	./install/push-backend.sh && ./install/push-frontend.sh

.PHONY: deploy-backend
deploy-backend: oc-login
	./install/deploy-backend.sh

.PHONY: deploy-frontend
deploy-frontend: oc-login
	./install/deploy-frontend.sh

.PHONY: deploy
deploy: oc-login
	./install/deploy-backend.sh && ./install/deploy-frontend.sh

.PHONY: undeploy-backend
undeploy-backend: oc-login
	./install/undeploy-backend.sh

.PHONY: undeploy-frontend
undeploy-frontend: oc-login
	./install/undeploy-frontend.sh

.PHONY: undeploy
undeploy: oc-login
	./install/undeploy-backend.sh && ./install/undeploy-frontend.sh

.PHONY: delete
delete:
	${OC} login ${OC_URL} -u ${OC_USER} -p ${OC_PASSWORD} --insecure-skip-tls-verify=true
	${OC} project ${PROJECT} 2> /dev/null && oc delete project ${PROJECT}
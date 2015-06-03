#!/usr/bin/env bash

# Delete all - but dont stop the cluster

echo Deleting containers
kubectl delete -f ssoconfig-controller.yaml
kubectl delete -f opendj-controller.yaml
kubectl delete -f openam-controller.yaml
kubectl delete -f openam-controllerb.yaml


echo Re-creating containers
kubectl create -f opendj-controller.yaml
kubectl create -f openam-controller.yaml
kubectl create -f openam-controllerb.yaml

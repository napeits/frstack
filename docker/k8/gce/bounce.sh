#!/usr/bin/env bash

# Delete all - but dont stop the cluster



kubectl delete -f opendj-controller.yaml
kubectl delete -f openam-controller.yaml
kubectl delete -f openam-controllerb.yaml



kubectl create -f opendj-controller.yaml
kubectl create -f openam-controller.yaml
kubectl create -f openam-controllerb.yaml

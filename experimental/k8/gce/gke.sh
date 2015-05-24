#!/usr/bin/env bash


# Create a cluster
gcloud alpha container clusters create openam --num-nodes 2 --machine-type  n1-standard-1


# Use kubectl locally
kubectl  config use-context gke_forgerockdemo_us-central1-a_openam



# Create openam

kubectl create -f openam-controller.yaml
kubectl create -f openam-service.yaml




# Delete the cluster
gcloud alpha container clusters delete openam



#!/usr/bin/env bash

cd /var/tmp

C=openam-configurator-tool*.jar

# todo: Put a wait loop for the openam-svc-a:80 to come up before runnign

java -jar $C -f master.properties
java -jar $C -f second.properties

echo done config

# todo - take this out when we get it right. This is to allow us to log on to the container.
sleep 1000000
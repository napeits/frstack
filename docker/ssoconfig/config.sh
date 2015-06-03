#!/usr/bin/env bash

cd /var/tmp

java -jar configurator.jar --acceptLicense -f master.properties
java -jar configurator.jar --acceptLicense -f second.properties

echo done config

# todo - take this out when we get it right. This is to allow us to log on to the container.
sleep 1000000
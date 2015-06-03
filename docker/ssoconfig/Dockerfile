FROM java:8

RUN curl http://maven.forgerock.org/repo/simple/snapshots/org/forgerock/openam/openam-configurator-tool/13.0.0-SNAPSHOT/ \
   | grep -o 'href=.*\.jar\"' xx | grep -v sources | grep -o 'http.*jar' | xargs curl -o /var/tmp/configurator.jar


COPY master.properties /var/tmp
COPY second.properties /var/tmp
COPY config.sh /var/tmp

CMD ["/var/tmp/config.sh"]


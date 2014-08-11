# Install the ForgeRock Open Identity Stack (OIS)


NOTE: This is currently a work in progress. This should work for fedora / vagrant. Other 
combinations have not been tested. 



Installs the ForgeRock Open Identity Stack (OIS) onto a target environment.
This uses [Ansible](https://github.com/ansible/ansible) to automate the installation. This has been
tested using [Vagrant](http://www.vagrantup.com/), but it should also work on AWS or GCE. 


## But what does it do?

This will configure a Fedora image to run the ForgeRock OIS stack. After completion the guest image 
will have the following installed:

* haproxy to route ports 80/443 to various backend services
* openidm running on port 9090 (proxied at  http://openam.example.com/openidm  and /openidmui )
* opendj running on port 389. This is the user store. 
* openam running on port 8080 (proxied at https://openam.example.com/openam)
* openig running on port 28080 


## Quick Start

* Install Ansible and Vagrant and make sure they are both in your PATH. If you are on a
  mac you can install ansible using 
  ```brew install ansible```
* Update group_vars/all for any environment specific configuration. See the comments on using a proxy server
* Update vars/nightly.ymlwith the URL locations of the ForgeRock products. These will change over time
   so you might have to tweak the locations. The current process uses nightly builds
* Optional: Add your public ssh key to roles/create-fr-user/files. This will enable you to login as the ForgeRock user "fr". You may also have 
 to edit roles/create-fr-user/tasks/main.yml to reflect the name of your pub key file
  Note that if you do not do this you can ssh to the image using

```vagrant ssh```

* Execute the following:

```/bin/sh
vagrant up
```

* Put the IP address of the guest in your local /etc/hosts file. The Vagrant image is 
  configured to use a host only IP:

`192.168.56.11 openam.example.com`

* Login to OpenAM at http://openam.example.com/openam  (amadmin/password)
* Login to OpenIDM at http://openam.example.com/openidmgui  (openidm-admin/openidm-admin)
* View the haproxy status page at https://openam.example.com/haproxy?stats
* View the default Apache landing page at https://openam.example.com/  [NOT DONE YET]
* You can ssh into the guest using `ssh fr@openam.example.com` 
* Using an ldap browser (Apache Directory Studio, for example) you can browse the user store at openam.example.com:389,   
  cn=Directory Manager / password

## Using a proxy server 

You can edit group_vars/all and uncomment the proxy server configuration.  Ansible will use 
the proxy when installing packages and when downloading zip files. 

Even if you are not behind a corporate firewall you may want to consider using a caching proxy
such as squid. You can install "squidman" for the mac.  

This build will download a lot of software packages (approx 1 GB...)
and if you re-run it (example: to create a new node, test configuration changes, etc) you
will end up downloading all those bits each time you build. A caching proxy will speed up the process 
by caching the packages and zip files.  You may want to edit the squid configuration on 
the mac (~/Libraries/Preferences/squid.conf) and increase the size of maximum_object_size 
to 400GB (the OpenAM all-in distribution is approx. 350 GB)


## Notes

* Assumes a Fedora guest image 
* Uses systemd for init files. 
* For consistency between environments we create a forgerock user ("fr" - because no one likes to type 
long names). Most things run under this users account. You can ssh fr@opename.example.com


## Ansible Notes

The install is split into two top level playbooks. The first playbook (vagrant.xml) primes the environment required 
for the main ForgeRock playbook (frstack.yml). Over time there will be an amazon.yml playbook, a gce.yml, and so on.

The first playbook is responsible for installing a few base O/S packages and for create the "fr" forgerock user under
which the products will be installed. 

The second playbook "frstack.yml" does most of the heavy lifting and completes the install. 
The frstack.yml should be generic enough to run on any environment. This playbook is included from vagrant.yml  


### TODO


Bug fixing needed:
* Make this work on both Debian / Fedora (anything that support systemd).
* looks like the HOSTNAME needs to be set to the fqdn on the machine /etc/sysconfig/network  or openam config bombs out
  This is fixed for Vagrant by setting config.vm.hostname. Need a fix for other environments
* tomcat agent installer does not put filter in global web.xml. Need to fix up apps web.xml
* Configure agents (right now apache is installed but not configured)
* Configure some sample policies
* Add HA, multi-master replication, etc

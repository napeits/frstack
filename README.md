# Install the ForgeRock Open Identity Stack (OIS)


Installs the ForgeRock Open Identity Stack (OIS) onto a target environment.
This uses [Ansible](https://github.com/ansible/ansible) to automate the installation. This has been
tested using [Vagrant](http://www.vagrantup.com/), but it should also work on AWS or GCE. 


## But what does it do?

This will configure a Centos image to run the ForgeRock OIS stack. After completion the guest image 
will have the following installed:

* haproxy to route ports 80/443 to various backend services
* apache instance running on port 1080 (as yet unused)
* openidm running on port 9090 (proxied at  http://openam.example.com/openidm)
* opendj running on port 389. This is the user store. 
* openam running on port 8080 (proxied at https://openam.example.com/openam)
* openig running on port 28080 


## Sounds Great. How do I get this running?

* Install Ansible and Vagrant and make sure they are both in your PATH
* Update group_vars/all with the URL locations of the ForgeRock products. These will change over time
 so you might have to tweak the locations. The current process uses nightly builds.
* Add your public ssh key to roles/create-fr-user/files. This will enable you to login as the fr user. You may also have 
 to edit roles/create-fr-user/tasks/main.yml to reflect the name of your pub key file
* Execute the following:

```/bin/sh
bin/rock
```

* Put the IP address of the guest in your /etc/hosts file:
`xx.xx.xx.xx openam.example.com`
* Login to OpenAM at http://openam.example.com/openam  (amadmin/password)
* Login to OpenIDM at http://openam.example.com/openidmgui  (openidm-admin/openidm-admin)
* View the haproxy status page at https://openam.example.com/haproxy?stats
* View the default Apache landing page at https://openam.example.com/
* You can ssh into the guest using `ssh fr@openam.example.com`
* Using an ldap browser (Apache Directory Studio, for example) you can browse the user store at openam.example.com:389,   
  cn=Directory Manager / password


## Notes

* Assumes a RH/Centos like guest image (uses yum)
* For consistency between environments we create a forgerock user ("fr" - because no one likes to type 
long names). Most things run under this users account. You can ssh fr@opename.example.com
* OpenDJ is installed using the rpm - and runs as root (so we can run on port 389)

## Ansible Notes

The install is split into two top level playbooks. The first playbook (vagrant.xml) primes the environment required 
for the main ForgeRock playbook (frstack.yml). Over time there will be an amazon.yml playbook, a gce.yml, and so on.

The first playbook is responsible for installing a few base O/S packages and for create the "fr" forgerock user under
which the products will be installed. 

The role "download-local" is responsible for downloading packages for installation. Note that for vagrant,
this is downloaded to the host directory, and mounted as a folder (/var/tmp/software) on the guest. 

You may find it easier to just download the software packages manually.

The frstack.yml should be generic enough to run on any environment.  


### TODO


Bug fixing needed:
* looks like the HOSTNAME needs to be set to the fqdn on the machine /etc/sysconfig/network  or openam config bombs out
  This is fixed for Vagrant by setting config.vm.hostname. Need a fix for other hosts
* tomcat agent installer does not put filter in global web.xml. Need to fix up apps web.xml

* Create fr/.bashrc file with path to common commands
* More dynamic configuration (cookie domains, base DN, etc). 
* Configure agents (right now apache is installed but not configured)
* Configure some sample policies
* Add HA, multi-master replication, etc

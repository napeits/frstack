# vagrant high availability configuration

This configuration installs all ForgeRock products onto two vagrant hosts. This is suitable for testing high availability failover

### TOdo: work in progress. This is not done

## Usage 

vagrant up|Creates VM and runs ansible provisioning.
vagrant provision| Re-run vagrant provisioning 
./frstack [tags]|Run ansibe playbook manually. You can optional suppply a comma seperated list of tags - which will run only those tasks with the given tag.


vagrant ssh oisa|oisb  -  ssh into the guest 

The guests will be provisioned with a host only IP of 192.168.56.11 and  192.168.56.12 . Add an entry to your /etc/hosts file, and then bring up a web browser to http://openam.example.com 

192.168.56.11 openam.example.com oisa oisa.example.com
192.168.56.12 oisb oisb.example.com


# Notes: the firt host will have the haproxy install 


# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    # This box has dissappeared...
    # config.vm.box = "hfm4/centos7"
    config.vm.box = "matyunin/centos7"

    config.vm.define "oisserver" do |v| 
        #v.vm.box = "box-cutter/fedora20"
        v.vm.hostname = "openam.example.com"
        v.vm.network :private_network, ip: "192.168.56.11"
    end
  
  

    config.vm.provider :virtualbox do |vb|
  		vb.customize ["modifyvm", :id, "--memory", "2048"]
    end
   
    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "vagrant.yml"
        #Use the auto-generated inventory
        #ansible.inventory_path = "hosts"
        ansible.verbose = true
        ansible.sudo = true
        # This should avoid checking for an existing host in your known_hosts file
        ansible.host_key_checking = false
        # groups
        ansible.groups = {
            "ois" => ["oisserver"]
            
        }
    end
end

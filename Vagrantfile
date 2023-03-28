# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  config.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end

     # Frontend machine
    config.vm.define "frontend" do |frontend|
      frontend.vm.box = "generic/debian11"
      frontend.vm.network :forwarded_port, host: 1234, guest: 5173
      frontend.vm.network "private_network", ip: "192.168.56.3"
	  frontend.vm.provision "file", source:"frontend",destination: "~/chmury-w-aplikacjach/frontend"
      frontend.vm.provision "ansible" do |ansible|
        ansible.playbook = "frontend.yml"
      end
    end 

    # Database machine
    config.vm.define "database" do |database|
        database.vm.box = "ubuntu/xenial64"
        database.vm.network "private_network", ip: "192.168.56.6"
        database.vm.provision "ansible" do |ansible|
            ansible.playbook = "database.yml"
        end
    end
 
	# Backend machine
    config.vm.define "backend" do |backend|
      backend.vm.box = "generic/debian11"
      backend.vm.network "private_network", ip: "192.168.56.4"
	  backend.vm.provision "file", source:"backend",destination: "/home/vagrant/chmury-w-aplikacjach/backend"
      backend.vm.provision "ansible" do |ansible|
        ansible.playbook = "backend.yml"
      end
    end 
  end
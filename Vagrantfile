# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "lucid64"
  config.vm.box_url = "http://puppet-vagrant-boxes.puppetlabs.com/ubuntu-server-10044-x64-vbox4210.box"
  config.vm.provision :shell, :path => 'puppet-modules.sh'
  config.vm.provision :puppet do |puppet|
      #puppet.options = '--verbose --debug'
  end
  config.vm.provider "virtualbox" do |v|
    v.customize [
                 "modifyvm", :id,
                 "--memory", "1024",
                 "--cpus",   "2"
                 ]
  end

  # apt cache - skip bunch of downloads if ever need to recreate
  config.vm.synced_folder 'apt-cache', '/var/cache/apt/archives'

  # tpx port
  config.vm.network :forwarded_port, guest: 5000, host: 5000

  # following line would require mongo on a separate fileshare
  config.vm.synced_folder "src/", "/home/vagrant/info-sequences"
end

exec {'add-node-repo':
    command => '/usr/bin/add-apt-repository ppa:chris-lea/node.js',
    #before => Exec['apt-get-update'],
    require => [Package['python-software-properties'],
                Package['software-properties-common']]
}
exec {'hack-apt-update':
    command => '/usr/bin/apt-get update',
    require => Exec['add-node-repo']
}

file { "apt-cache-partial":
    ensure => "directory",
    owner  => "root",
    group  => "root",
    mode   => 755,
    path   => "/var/cache/apt/archives/partial",
}

exec { 'apt-get-update':
    command => '/usr/bin/apt-get update',
    require => [File["apt-cache-partial"],],
}

# run apt-get update before package installs
Exec['apt-get-update'] -> Package <| |>

package {'software-properties-common':
    ensure => 'installed'
}
package { 'python-software-properties':
    ensure => 'installed'
}
package { 'unzip':
    ensure => 'installed'
}
package { 'screen':
    ensure => 'installed'
}
package { 'git-core':
    ensure => 'installed'
}
package { 'curl':
    ensure => 'installed'
}
package { 'libxslt1-dev':
    ensure => 'installed'
}
package { 'g++':
    ensure => 'installed'
}
package {'nodejs':
    ensure => 'installed',
    require=> [Exec['hack-apt-update'],],
}
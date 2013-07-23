#!/bin/sh -e
if ! puppet module list | grep -q puppetlabs-nodejs; then
    puppet module install puppetlabs-nodejs
fi
if ! puppet module list | grep -q stdlib; then
    puppet module install puppetlabs/stdlib
fi

#!/bin/bash -e

if [ -z "$(ls -A /etc/dhcp)" ]; then
        cp -rf /etc/dhcp.orig/* /etc/dhcp/

cat <<EOF > /etc/dhcp/dhcpd.conf
# dhcpd.conf
#
# Sample configuration file for ISC dhcpd
#
# Attention: If /etc/ltsp/dhcpd.conf exists, that will be used as
# configuration file instead of this file.
#

# option definitions common to all supported networks...
#option domain-name "vpn.cloud.gate";
#option domain-name-servers ns1.example.org, ns2.example.org;

default-lease-time 604800;
max-lease-time 604800;

# The ddns-updates-style parameter controls whether or not the server will
# attempt to do a DNS update when a lease is confirmed. We default to the
# behavior of the version 2 packages ('none', since DHCP v2 didn't
# have support for DDNS.)
ddns-update-style none;

# If this DHCP server is the official DHCP server for the local
# network, the authoritative directive should be uncommented.
#authoritative;

# This is a very basic subnet declaration.

subnet 192.168.222.0 netmask 255.255.255.0 {
  range 192.168.222.10 192.168.222.50;
}

# Fixed IP addresses can also be specified for hosts.   These addresses
# should not also be listed as being available for dynamic assignment.
# Hosts for which fixed IP addresses have been specified can boot using
# BOOTP or DHCP.   Hosts for which no fixed address is specified can only
# be booted with DHCP, unless there is an address range on the subnet
# to which a BOOTP client is connected which has the dynamic-bootp flag
# set.
host my_pi3bp {
  hardware ethernet 5e:48:e6:51:5f:6d;
  fixed-address 192.168.222.14;
}

EOF

fi

echo 'INTERFACESv4="tap_vpnsrv"' >>  /etc/default/isc-dhcp-server

/etc/init.d/isc-dhcp-server start

#!/bin/bash -e

apt install -y isc-dhcp-server

mv /etc/dhcp /etc/dhcp.orig

#!/bin/bash

/root/vpn_setup.sh
/root/nginx_setup.sh
/root/dhcp_setup.sh
bash -c "while sleep 60; do true; done"

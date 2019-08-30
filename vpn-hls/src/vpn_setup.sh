#!/bin/bash -e

BRIDGENAME=vpnsrv
IPADDR="192.168.222.1/24"

if [ -z "$(cat /usr/vpnserver/vpn_server.config)" ]; then
	INIT=1
fi

vpnserver start && sleep 1

if [ -z $INIT ]; then
	ip a add $IPADDR dev tap_$BRIDGENAME
	exit
fi

vpncmd localhost /SERVER /CMD HubDelete "default"
vpncmd localhost /SERVER /CMD HubCreate "mainhub" /PASSWORD:"mainhub"
vpncmd localhost /SERVER /CMD BridgeCreate "mainhub" /DEVICE:"$BRIDGENAME" /TAP:yes
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD GroupCreate "maingroup" /REALNAME:"Main Group" /NOTE:"Test group"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserCreate "vpnuser1" /GROUP:"maingroup" /REALNAME:"Vpn User 1" /NOTE:"Test user"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserCreate "vpnuser2" /GROUP:"maingroup" /REALNAME:"Vpn User 2" /NOTE:"Test user"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserCreate "vpnuser3" /GROUP:"maingroup" /REALNAME:"Vpn User 3" /NOTE:"Test user"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserPasswordSet "vpnuser1" /PASSWORD:"vpnuser1"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserPasswordSet "vpnuser2" /PASSWORD:"vpnuser2"
vpncmd localhost /SERVER /HUB:"mainhub" /PASSWORD:"mainhub" /CMD UserPasswordSet "vpnuser3" /PASSWORD:"vpnuser3"

vpnserver stop && sleep 1
vpnserver start && sleep 1

ip a add $IPADDR dev tap_$BRIDGENAME

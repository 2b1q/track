#!/bin/bash
#
#
sudo docker run \
  --cap-add=NET_ADMIN \
  --device /dev/net/tun:/dev/net/tun \
  -p 80:80/tcp \
  -p 8080:8080/tcp \
  -p 443:443/tcp \
  -p 992:992/tcp \
  -p 1194:1194/udp \
  -p 5555:5555/tcp \
  -v $PWD/data/vpn/vpn_server.config:/usr/vpnserver/vpn_server.config \
  -v $PWD/data/nginx:/etc/nginx/ \
  -v $PWD/data/dhcp:/etc/dhcp/ \
  -e no_proxy=$no_proxy \
  -e ftp_proxy=$ftp_proxy \
  -e http_proxy=$http_proxy \
  -e https_proxy=$https_proxy \
  --rm \
  $@ \
  vpn-hls-proxy:test0.1

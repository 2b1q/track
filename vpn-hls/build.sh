#!/bin/bash
#
#
DOCKER_NAME=vpn-hls-proxy:test0.1

# Build
sudo docker build \
  --build-arg no_proxy=$no_proxy \
  --build-arg ftp_proxy=$ftp_proxy \
  --build-arg http_proxy=$http_proxy \
  --build-arg https_proxy=$https_proxy \
  . -t $DOCKER_NAME

#Init config
rm -rf $(dirname @0)/data
mkdir -p $(dirname @0)/data/vpn && echo "" > $(dirname @0)/data/vpn/vpn_server.config
mkdir -p $(dirname @0)/data/nginx
mkdir -p $(dirname @0)/data/dhcp

#!/bin/bash -e

mkdir /root/se && cd /root/se
  wget -q https://github.com/SoftEtherVPN/SoftEtherVPN_Stable/archive/v4.29-9680-rtm.tar.gz
  tar xf v4.29-9680-rtm.tar.gz
  cd SoftEtherVPN_Stable-4.29-9680-rtm
  ./configure >/dev/null
  make install >/dev/null 2>&1
cd / && rm -rf /root/se

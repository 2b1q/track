FROM  ubuntu:18.04
LABEL description="test-vpn-proxy"

ENV DEBIAN_FRONTEND=noninteractive

RUN   apt update && apt upgrade -y
RUN   apt install -y apt-utils
RUN   apt install -y wget
RUN   apt install -y build-essential
RUN   apt install -y libreadline-dev
RUN   apt install -y libssl-dev
RUN   apt install -y libncurses5-dev
RUN   apt install -y libz-dev
RUN   apt install -y curl
RUN   apt install -y gnupg2
RUN   apt install -y lsb-release
RUN   apt install -y iproute2

ADD src /root
RUN mkdir /usr/vpnserver/
# RUN cp /root/vpn_server.config /usr/vpnserver/

RUN   /root/vpn_install.sh
RUN   /root/nginx_install.sh
RUN   /root/dhcp_install.sh

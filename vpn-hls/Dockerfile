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
COPY  src/vpn_install.sh /root
RUN   /root/vpn_install.sh
RUN   apt install -y curl
RUN   apt install -y gnupg2
RUN   apt install -y lsb-release
COPY  src/nginx_install.sh /root
COPY  src/vpn_server.config /usr/vpnserver/
RUN   /root/nginx_install.sh
RUN   apt install -y iproute2
COPY  src/dhcp_install.sh /root
RUN   /root/dhcp_install.sh

COPY  src/vpn_setup.sh /root
COPY  src/nginx_setup.sh /root
COPY  src/dhcp_setup.sh /root
COPY  src/run.sh /root
# CMD /root/run.sh

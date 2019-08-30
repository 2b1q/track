#!/bin/bash -e

if [ -z "$(ls -A /etc/nginx)" ]; then
	cp -rf /etc/nginx.orig/* /etc/nginx/

cat <<EOF > /etc/nginx/conf.d/default.conf
# For HTTPS
ssl_session_cache   shared:SSL:10m;
ssl_session_timeout 5m;
ssl_prefer_server_ciphers on;
ssl_stapling on;
resolver 8.8.8.8;


server {
  listen 80;

# CORS
  add_header 'Access-Control-Allow-Origin' '*';

  location /1/ {
    proxy_pass http://192.168.222.14:4004/;
    proxy_redirect / /1/;

    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    add_header 'Access-Control-Allow-Origin' '*';
    expires off;
  }

  location /2/ {
    proxy_pass http://192.168.222.16:4004/;
    proxy_redirect / /2/;

    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    add_header 'Access-Control-Allow-Origin' '*';
    expires off;
  }

  location /3/ {
    proxy_pass http://192.168.222.32:4004/;
    proxy_redirect / /3/;

    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    add_header 'Access-Control-Allow-Origin' '*';
    expires off;
  }

  location / {
    root /www;
  }
}

server {
  listen 8080;

# CORS
  add_header 'Access-Control-Allow-Origin' '*';

  root /www;

  location ~ \.(m3u8)$ {
    add_header 'Cache-Control' 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    add_header 'Access-Control-Allow-Origin' '*';
    expires off;
  }
}

EOF

fi

/etc/init.d/nginx start && sleep 1

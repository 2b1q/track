FROM node:alpine AS builder

WORKDIR /app

COPY ./angular.json .
COPY ./karma.conf.js .
COPY ./package.json .
COPY ./tsconfig.app.json .
COPY ./tsconfig.json .
COPY ./tsconfig.spec.json .
COPY ./tslint.json .
COPY ./browserslist .
COPY ./src ./src

RUN npm install && \
  npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# WORKDIR /usr/share/nginx/html

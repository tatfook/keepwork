FROM xuntian/node:10.1-npm-5.6-yarn-1.6 as builder
MAINTAINER xuntian "li.zq@foxmail.com"

COPY ./ /code/
WORKDIR /code
ARG BUILD_ENV
ARG KEEPWORK_LOCALE
RUN NODE_ENV=${BUILD_ENV} KEEPWORK_LOCALE=${KEEPWORK_LOCALE} TZ=Asia/Shanghai yarn build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder /code/dist .
CMD ["nginx", "-g", "daemon off;"]

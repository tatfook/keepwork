From node as builder
MAINTAINER xuntian "li.zq@foxmail.com"
COPY ./ /build/
WORKDIR /build
RUN npm --registry https://registry.npm.taobao.org install
# RUN npm --registry https://registry.npm.taobao.org update
RUN npm run build


FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder /build/dist .
CMD ["nginx", "-g", "daemon off;"]

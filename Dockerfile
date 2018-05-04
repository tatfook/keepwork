From xuntian/node-yarn as builder
MAINTAINER xuntian "li.zq@foxmail.com"
COPY ./ /code/
WORKDIR /code
# RUN npm --registry https://registry.npm.taobao.org install
# RUN npm --registry https://registry.npm.taobao.org update
# RUN npm run build
ARG BUILD_ENV
RUN yarn config set registry http://registry.npm.taobao.org/ && yarn install
RUN NODE_ENV=${BUILD_ENV} TZ=Asia/Shanghai yarn build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder /code/dist .
COPY --from=builder /code/node_modules /node_modules
CMD ["nginx", "-g", "daemon off;"]

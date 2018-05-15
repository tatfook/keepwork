FROM xuntian/node-yarn as builder
MAINTAINER xuntian "li.zq@foxmail.com"
COPY ./ /code/
WORKDIR /code
# RUN npm --registry https://registry.npm.taobao.org install
# RUN npm --registry https://registry.npm.taobao.org update
# RUN npm run build
ARG BUILD_ENV
ARG KEEPWORK_LOCALE
RUN yarn config set registry https://registry.npm.taobao.org/
# RUN yarn install --ignore-optional
RUN yarn install
RUN NODE_ENV=${BUILD_ENV} KEEPWORK_LOCALE=${KEEPWORK_LOCALE} TZ=Asia/Shanghai yarn build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder /code/dist .
COPY --from=builder /code/node_modules /node_modules
CMD ["nginx", "-g", "daemon off;"]

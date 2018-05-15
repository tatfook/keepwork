FROM xuntian/node-yarn
MAINTAINER xuntian "li.zq@foxmail.com"
COPY ./ /code/
WORKDIR /code
# RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install --registry http://10.28.18.2:4873
# RUN NODE_ENV=${BUILD_ENV} KEEPWORK_LOCALE=${KEEPWORK_LOCALE} TZ=Asia/Shanghai yarn build
RUN yarn test

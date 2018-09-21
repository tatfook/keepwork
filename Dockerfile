FROM node:8 as builder

RUN mkdir -p /code
WORKDIR /code
ADD package.json /code/package.json
RUN npm install

ARG BUILD_ENV
ARG KEEPWORK_LOCALE

COPY ./ /code/
RUN NODE_ENV=${BUILD_ENV} KEEPWORK_LOCALE=${KEEPWORK_LOCALE} yarn build
CMD yarn start

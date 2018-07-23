FROM node:8 as builder

RUN mkdir -p /code/
ADD package.json /code/package.json
ADD yarn.lock /code/yarn.lock
RUN cd /code && npm install

ARG BUILD_ENV
ARG KEEPWORK_LOCALE

COPY ./ /code/
WORKDIR /code
RUN NODE_ENV=${BUILD_ENV} KEEPWORK_LOCALE=${KEEPWORK_LOCALE} npm run build


FROM nginx:1.14
WORKDIR /usr/share/nginx/html
COPY --from=builder /code/dist .
CMD ["nginx", "-g", "daemon off;"]

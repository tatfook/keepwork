FROM xuantian/hologram-ruby-node as hologram_builder
MAINTAINER xuntian "li.zq@foxmail.com"
# RUN apt-get -y update && apt-get install -y nodejs npm cmake ruby-full && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY ./ /build/
WORKDIR /build
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install
RUN gem install bundle && gem install hologram && hologram hologram.yml

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=hologram_builder /build/docs .
CMD ["nginx", "-g", "daemon off;"]

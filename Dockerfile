FROM node:16-buster as builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build

RUN yarn global add pkg
RUN pkg /app/dist/index.js --out-path /app/shoppiserver -t node16-alpine-x64



FROM node:16-alpine

WORKDIR /app
RUN apk add --no-cache bash

COPY --from=builder /app/shoppiserver /app/shoppiserver
RUN npm -g install prisma
COPY --from=builder /app/prisma /app/prisma
COPY start.sh /app
EXPOSE 3003

CMD ["bash", "/app/start.sh"]

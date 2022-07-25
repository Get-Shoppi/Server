FROM node:16-buster as builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build

RUN yarn global add pkg
RUN pkg /app/dist/index.js --out-path /app/shoppiserver --debug -t node16-linux



FROM node:16-slim

WORKDIR /app
COPY --from=builder /app/shoppiserver /app/shoppiserver
EXPOSE 3003

CMD ["/app/shoppiserver/index"]

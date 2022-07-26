FROM node:16-buster as builder

WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build

FROM node:16-alpine

ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache bash

#Copy start script
COPY start.sh /app

#Install dependencies
COPY --from=builder /app/package.json /app
RUN yarn install --production

#Copy build output from previous step
COPY --from=builder /app/dist /app/dist
#Copy prisma files
COPY --from=builder /app/prisma /app/prisma
#Generate prisma clien
RUN yarn prisma generate

EXPOSE 3003
CMD ["bash", "/app/start.sh"]

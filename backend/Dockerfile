FROM node:jod-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN apk add --no-cache mongodb-tools

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
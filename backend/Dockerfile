FROM node:jod-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install MongoDB tools for sync
RUN apk add --no-cache mongodb-tools

EXPOSE 3000

CMD ["npm", "run", "dev"]
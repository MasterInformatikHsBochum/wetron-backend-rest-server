FROM node:8.4.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

ENTRYPOINT ["./node_modules/.bin/ts-node", "./src/index.ts"]

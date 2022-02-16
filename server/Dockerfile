FROM node:17
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install fast-csv
RUN npm install mysql

# Bundle app source
COPY . .

EXPOSE 8090

CMD [ "node", "index.js" ]

# Source: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
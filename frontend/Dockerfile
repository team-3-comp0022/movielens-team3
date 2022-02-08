FROM node:16
WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# Bundle app source
COPY . ./src

EXPOSE 3001:3000

CMD ["npm", "start"]

# Sources: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/, https://mherman.org/blog/dockerizing-a-react-app/
FROM  node:16

# All subsequent commands will now be run from inside this folder
RUN mkdir -p /server
WORKDIR /server
# Copy all the code in the local directory into the container’s working directory
COPY ./ ./

RUN npm install

CMD [ "npm", "start" ]

# Source: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
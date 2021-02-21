FROM node:12-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install web server
RUN npm install -g http-server

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Install dependencies
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]

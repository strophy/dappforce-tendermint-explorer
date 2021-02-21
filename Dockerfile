FROM node:12-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# Install app dependencies
COPY package*.json /usr/src/app/
RUN npm install

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# Install dependencies
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]

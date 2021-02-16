FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install dependencies
RUN npm install && npm run build

EXPOSE 8080
CMD [ "npm", "run", "serve" ]

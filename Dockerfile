FROM node:16.14-alpine AS builder

ARG BUILD_VERSION=NOT_SET

ARG ENVIRONMENT=production

ARG NPM_USER=unknown
ENV NPM_USER=${NPM_USER}

ARG NPM_AUTH_TOKEN=unknown
ENV NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}

ARG NPM_EMAIL=james@freebytech.com
ENV NPM_EMAIL=${NPM_EMAIL}

RUN mkdir /app
WORKDIR /app

RUN npm install -g npm-cli-login

COPY package.json ./package.json
COPY package-lock.json .
RUN npm install

COPY . .
RUN cd projects/fb-transcription | npm version ${BUILD_VERSION}
RUN npm-cli-login -u '${NPM_USER}' -p '${NPM_AUTH_TOKEN}' -e '${NPM_EMAIL}'
RUN npm run build -- --configuration ${ENVIRONMENT}

RUN npm run publish
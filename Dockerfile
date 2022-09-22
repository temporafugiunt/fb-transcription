FROM node:16.14-alpine AS builder

ARG BUILD_VERSION=NOT_SET

ARG ENVIRONMENT=production

ARG NPM_USER=unknown
ENV NPM_USER=${NPM_USER}

ARG NPM_AUTH_TOKEN=unknown
ENV NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}

ARG NPM_EMAIL=james@freebytech.com
ENV NPM_EMAIL=${NPM_EMAIL}

ARG NPM_SCOPE=unknown
ENV NPM_SCOPE=@${NPM_SCOPE}

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV NPM_REGISTRY=${NPM_REGISTRY}

RUN mkdir /app
WORKDIR /app

# RUN npm install -g npm-cli-login

COPY package.json ./package.json
COPY package-lock.json .
RUN npm install

COPY . .
# RUN echo npm-cli-login -u ${NPM_USER} -p ${NPM_AUTH_TOKEN} -e ${NPM_EMAIL} -r ${NPM_REGISTRY} -s ${NPM_SCOPE}
# RUN npm-cli-login -u ${NPM_USER} -p ${NPM_AUTH_TOKEN} -e ${NPM_EMAIL} -r ${NPM_REGISTRY} -s ${NPM_SCOPE}
RUN sed -i "s/NPM_AUTH_TOKEN/${NPM_AUTH_TOKEN}/" .npmrc
RUN npm run build -- --configuration ${ENVIRONMENT}

RUN npm run publish
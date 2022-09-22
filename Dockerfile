FROM node:16.14-alpine AS builder

ARG BUILD_VERSION=NOT_SET

ARG ENVIRONMENT=production

ARG NPM_AUTH_TOKEN=unknown
ENV NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}

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
FROM node:16.14-alpine AS builder

ARG BUILD_VERSION=NOT_SET

ARG ENVIRONMENT=production

ARG GITHUB_USER_PAT=unknown
ENV GITHUB_USER_PAT=${GITHUB_USER_PAT}

RUN mkdir /app
WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json .
RUN npm install

COPY . .
RUN sed -i "s/REPO_USER_PAT/${GITHUB_USER_PAT}/g" .npmrc

RUN npm run build -- --configuration ${ENVIRONMENT} 
RUN npm run publish
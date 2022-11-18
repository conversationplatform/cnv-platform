

FROM --platform=linux/amd64 node:16 as builder-app

WORKDIR /cnv-platform

COPY . .

RUN yarn install:app
RUN yarn build:app

FROM node:16 as builder-dashboard

WORKDIR /cnv-platform

COPY . .

RUN yarn install:dashboard
RUN yarn build:dashboard


FROM node:16 as builder-plugins-core

WORKDIR /cnv-platform

COPY . .

RUN yarn install:plugins:core
RUN yarn build:plugins:core
RUN yarn pack:plugins:core


FROM node:16 as builder-plugins-essentials

WORKDIR /cnv-platform

COPY . .

RUN yarn install:plugins:essentials
RUN yarn build:plugins:essentials
RUN yarn pack:plugins:essentials

FROM node:16 as builder-middleware

WORKDIR /cnv-platform

COPY . .

#RUN curl -sf https://gobinaries.com/tj/node-prune | sh

RUN yarn install:middleware
RUN yarn build:middleware
COPY --from=builder-plugins-core /cnv-platform/cnv-core.tgz /cnv-platform/middleware/ 
COPY --from=builder-plugins-essentials /cnv-platform/cnv-essentials.tgz /cnv-platform/middleware/
WORKDIR /cnv-platform/middleware
RUN yarn add file:cnv-core.tgz
RUN yarn add file:cnv-essentials.tgz

RUN npm prune --production
#RUN node-prune


FROM node:16-alpine as final

WORKDIR /cnv-platform

COPY --from=builder-app /cnv-platform/public/app public/app
COPY --from=builder-dashboard /cnv-platform/public/dashboard public/dashboard

COPY --from=builder-middleware /cnv-platform/middleware/node_modules/ /cnv-platform/middleware/node_modules
COPY --from=builder-middleware /cnv-platform/middleware/dist/ /cnv-platform/middleware/dist
COPY --from=builder-middleware /cnv-platform/middleware/package.json /cnv-platform/middleware/
COPY --from=builder-plugins-core /cnv-platform/cnv-core.tgz /cnv-platform/middleware/ 
COPY --from=builder-plugins-essentials /cnv-platform/cnv-essentials.tgz /cnv-platform/middleware/

EXPOSE 3000
EXPOSE 1880

CMD ["yarn", "--cwd", "middleware", "start:prod"]
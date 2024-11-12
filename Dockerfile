FROM node:22-alpine as builder
WORKDIR /builder
COPY ./package.json ./
RUN npm install

COPY . ./
RUN npm run build
RUN ls -al && pwd
FROM httpd

COPY --from=builder /builder/dist/ /usr/local/apache2/htdocs/
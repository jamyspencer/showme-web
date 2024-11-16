FROM node:22-alpine as builder
WORKDIR /builder
COPY ./package.json ./
RUN npm install

COPY . ./
RUN npm run build
RUN ls -al && pwd
FROM httpd

COPY --from=builder /builder/dist/ /usr/local/apache2/htdocs/
# RUN sed -i '/DirectoryIndex\sindex.html/a \ \ \  FallbackResource /index.html' /usr/local/apache2/conf/httpd.conf
RUN  sed -r -i 's/#(LoadModule rewrite_module modules\/mod_rewrite.so)/\1/' /usr/local/apache2/conf/httpd.conf
RUN sed -r -i 's/(AllowOverride) None/\1 All/' /usr/local/apache2/conf/httpd.conf

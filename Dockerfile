FROM node:alpine
WORKDIR /var/novel-reader/
COPY ./dist/ .npmrc package.json ./
RUN apk add --no-cache --virtual .gyp \
            python \
            make \
            g++ \
        && npm install --only=prod --production --verbose \
        && apk del .gyp
CMD [ "node", "./web/platforms/web/server.js" ]

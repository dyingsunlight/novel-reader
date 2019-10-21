FROM node:alpine
WORKDIR /var/novel-reader/
COPY ./dist/ .npmrc package.json ./
RUN npm install --only=prod --production --verbose

CMD [ "node", "./server/server.js" ]

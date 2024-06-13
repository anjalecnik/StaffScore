FROM node:slim

ENV NODE_ENV development

WORKDIR /express-docker

COPY . .

RUN npm install

CMD [ "node", "index.js" ]

EXPOSE 5000
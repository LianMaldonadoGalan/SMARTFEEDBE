FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .
ENV PG_CONNECTION_STRING_DEV=
ENV PG_CONNECTION_STRING_PROD=
ENV NODE_ENV=

CMD ["npm", "start"]
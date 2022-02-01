FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .
ENV PG_CONNECTION_STRING=
CMD ["npm", "start"]
FROM node:18-alpine

WORKDIR /app

COPY ["package*.json" ,"./" ]

RUN npm install

COPY . .

EXPOSE 3052

CMD [ "node","server.js" ]
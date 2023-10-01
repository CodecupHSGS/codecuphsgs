FROM node:latest

WORKDIR /usr/src/app

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./files ./files

RUN npm run build

ENV SOCKET_SERVER_PORT=8000
ENV HTTP_SERVER_PORT=5000
ENV LOG_DIR=./files/logs
ENV UPLOAD_DIR=./files/upload

CMD ["npm", "run", "start"]
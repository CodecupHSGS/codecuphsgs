FROM node:latest

WORKDIR /usr/src/app

COPY ./app ./app
COPY ./backend_api ./backend_api
COPY ./public ./public
COPY ./session_storage_api ./session_storage_api
COPY package.json package-lock.json* next.config.js postcss.config.js tailwind.config.js tsconfig.json ./

ENV BACKEND_URL=http://host.docker.internal:5000

RUN npm run build

CMD ["npm", "run", "start"]



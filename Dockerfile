FROM node:24.5.0-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host"]
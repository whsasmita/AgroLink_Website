FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host"]
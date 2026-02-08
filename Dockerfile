FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV TZ=America/Sao_Paulo
CMD ["npm", "run", "dev"]
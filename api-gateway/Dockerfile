FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3010
CMD ["node", "index.js"]

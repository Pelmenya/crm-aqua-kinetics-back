FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
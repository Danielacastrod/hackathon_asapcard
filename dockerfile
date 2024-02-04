
FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npx sequelize-cli db:create && npx sequelize-cli db:migrate


EXPOSE 3000

CMD ["node", "app.js"]

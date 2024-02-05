FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]

# criar imagem:   docker build -t hackaton/dockernode .
# rodar na porta 3000:      docker run -p 3000:3000 hackaton/dockernode

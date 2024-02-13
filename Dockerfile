FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -y

COPY . .

EXPOSE 5000

CMD [ "npm", "start"]

# criar imagem:   docker build -t hackaton/dockernode .
# rodar na porta 5000:      docker run -p 5000:5000 hackaton/dockernode

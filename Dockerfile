FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -y

COPY . .

EXPOSE 5000

CMD [ "npm", "start"]

#criar imagem do projeto Dockerfile:   docker image build -t hackaton:1.0.0 .  (o ponto é o contexto)

#criar os containeres do docker-compose.yml    docker-compose up -d

#postgres der algum erro:
#derrubar os conteineres               docker-compose down -v
# parar o banco postgresql             sudo service postgresql stop
#recriar os conteineres                docker-compose up -d

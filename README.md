# Documentação Técnica - Integração RabbitMQ e Sequelize com Docker (TypeScript)

Esta documentação descreve os detalhes técnicos da aplicação que integra o RabbitMQ com o Sequelize, utilizando TypeScript e Docker. A aplicação lida com a leitura e processamento de transações financeiras a partir de um arquivo CSV, além de evoluir para lidar com um segundo arquivo de conciliação.

## Nível 1 - Integração entre camadas

### Estrutura do Projeto
```plaintext
.
├── app
│   ├── src
│   │   ├── controllers
│   │   │   └── transactionController.ts
│   │   ├── models
│   │   │   ├── Person.ts
│   │   │   ├── Transaction.ts
│   │   │   └── Installment.ts
│   │   ├── services
│   │   │   └── transactionService.ts
│   │   └── app.js
│   ├── input-data.csv
│   └── docker-compose.yml
├── Dockerfile
└── README.md
```

### Comandos de Inicialização
```bash
# Para iniciar a aplicação
$ docker-compose up --build

# Para executar a aplicação
$ docker-compose exec app node app.js
```

### Fluxo de Processamento
1. O arquivo `input-data.csv` é lido e cada linha é convertida em uma mensagem JSON.
2. As mensagens são publicadas no RabbitMQ.
3. Um consumidor consome as mensagens e persiste os dados no banco de dados usando Sequelize.

### Modelo de Dados
#### Tabela `PERSON`
- `ID`: UUID (documento da pessoa)
- `Nome`: Nome da pessoa
- `Idade`: Idade da pessoa

#### Tabela `TRANSACTION`
- `ID`: UUID da transação
- `PERSON_ID`: ID da tabela PERSON
- `AMOUNT`: Valor total da transação
- `TRANSACTION_DATE`: Data da transação
- `STATUS`: Status da transação (inicialmente pendente)

#### Tabela `INSTALLMENT`
- `ID`: UUID da parcela
- `TRANSACTION_ID`: ID da transação na tabela TRANSACTION
- `INSTALLMENT_NUMBER`: Número da parcela
- `VALUE`: Valor da parcela

## Nível 2 - Evolução do negócio

### Alterações no Processo
1. Um segundo arquivo, `conciliation-data.csv`, será fornecido para conciliar as transações.
2. O arquivo terá as colunas: `ID da Transação`, `Data da Transação`, `Documento`, `Status`.
3. O campo `Status` pode ser 'C' (Processamento confirmado) ou 'N' (Processamento negado).

### Atualização do Programa
1. O programa que processa o primeiro arquivo deve ser modificado para inserir transações com STATUS pendente.
2. O programa que processa o segundo arquivo deve modificar o valor de cada transação na tabela TRANSACTION de acordo com o campo `Status`.git 

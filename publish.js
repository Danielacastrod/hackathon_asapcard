const fs = require('fs');
const csv = require('csv-parser');
const amqp = require('amqplib');

async function publishMessages() {
  const messages = [];

  // Leitura do arquivo CSV
  fs.createReadStream('input-data.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      const message = {
        transactionId: row['ID da Transação'],
        transactionDate: row['Data da Transação'],
        document: row['Documento'],
        name: row['Nome'],
        age: row['Idade'],
        amount: row['Valor'],
        numInstallments: row['Num. de Parcelas'],
      };

      messages.push(message);
    })
    .on('end', async () => {
      // Conectar ao RabbitMQ
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();

      // Declarar uma fila para as mensagens
      const queue = 'transactions_queue';
      await channel.assertQueue(queue, { durable: false });

      // Publicar cada mensagem na fila
      messages.forEach((message) => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      });

      console.log('Mensagens publicadas no RabbitMQ');

      // Fechar a conexão
      await channel.close();
      await connection.close();
    });
}

publishMessages();

import * as fs from 'fs';
import csv from 'csv-parser';
import * as amqp from 'amqplib';

interface CsvRow {
  'ID da Transação': string;
  'Data da Transação': string;
  'Documento': string;
  'Nome': string;
  'Idade': string;
  'Valor': string;
  'Num. de Parcelas': string;
}

interface TransactionMessage {
  transactionId: string;
  transactionDate: string;
  document: string;
  name: string;
  age: string;
  amount: string;
  numInstallments: string;
}

/**
 * Reads a CSV file, parses its rows, and publishes each row as a message to a RabbitMQ queue.
 */
async function publishMessages(): Promise<void> {
  const messages: TransactionMessage[] = [];

  // Reading the CSV file
  fs.createReadStream('input-data.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row: CsvRow) => {
      const message: TransactionMessage = {
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
      // Connecting to RabbitMQ
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();

      // Declaring a queue for the messages
      const queue = 'transactions_queue';
      await channel.assertQueue(queue, { durable: false });

      // Publishing each message to the queue
      messages.forEach((message) => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      });

      console.log('Messages published to RabbitMQ');

      // Closing the connection
      await channel.close();
      await connection.close();
    });
}

publishMessages();

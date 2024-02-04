import * as fs from 'fs';
import * as amqp from 'amqplib';
import csv from 'csv-parser';

interface CsvRow {
  '686e9b31-caeb-4908-95d5-931b50a8df9c': string;
  '2023-12-28T06:18:12Z': string;
  '123teste': string;
  'Bruce Wayne': string;
  '42': string;
  '87.28': string;
  '7': string;
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

  fs.createReadStream('input-data.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (row: CsvRow) => {
      const message: TransactionMessage = {
        transactionId: row['686e9b31-caeb-4908-95d5-931b50a8df9c'],
        transactionDate: row['2023-12-28T06:18:12Z'],
        document: row['123teste'],
        name: row['Bruce Wayne'],
        age: row['42'],
        amount: row['87.28'],
        numInstallments: row['7'],
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
      messages.forEach(message => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      });

      console.log('Messages published to RabbitMQ');

      // Closing the connection
      await channel.close();
      await connection.close();

      // Log das mensagens salvas para testes
      console.log('Mensagens salvas:', messages);
    });
}

export default publishMessages;

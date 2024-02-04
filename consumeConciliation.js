const amqp = require('amqplib');
const Transaction = require('./models/transaction');
const sequelize = require('./config/sequelize');

async function consumeConciliation() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const conciliationQueue = 'conciliation_queue';
  await channel.assertQueue(conciliationQueue, { durable: false });

  console.log('Aguardando mensagens de conciliação...');

  // Consumir mensagens da fila de conciliação
  channel.consume(
    conciliationQueue,
    async (msg) => {
      try {
        const conciliation = JSON.parse(msg.content.toString());

        // Atualizar o status na tabela Transaction
        await Transaction.update(
          { status: conciliation.status },
          { where: { personId: conciliation.document, status: 'pendente' } }
        );

        console.log(`Conciliação processada: ${msg.content.toString()}`);
      } catch (error) {
        console.error('Erro ao processar mensagem de conciliação:', error);
      }
    },
    { noAck: true }
  );
}

consumeConciliation();

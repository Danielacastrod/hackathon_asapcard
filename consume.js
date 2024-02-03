const amqp = require('amqplib');
const Person = require('./models/person'); // Importe o modelo Person
const Transaction = require('./models/transaction'); // Importe o modelo Transaction
const Installment = require('./models/installment'); // Importe o modelo Installment


const sequelize = require('./config/sequelize');


// Conectar ao RabbitMQ
async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'transactions_queue';
  await channel.assertQueue(queue, { durable: false });

  console.log('Aguardando mensagens...');

  // Consumir mensagens da fila
  channel.consume(queue, async (msg) => {
    const message = JSON.parse(msg.content.toString());

    // Iniciar uma transação Sequelize
    const t = await sequelize.transaction();

    try {
      // Verificar se a pessoa já existe na tabela Person
      let person = await Person.findOne({ where: { document: message.document } });

      // Se não existir, criar uma nova pessoa
      if (!person) {
        person = await Person.create({
          document: message.document,
          name: message.name,
          age: message.age,
        }, { transaction: t });
      }

      // Criar uma nova transação
      const transaction = await Transaction.create({
        id: message.transactionId,
        transactionDate: message.transactionDate,
        amount: message.amount,
        numInstallments: message.numInstallments,
        personId: person.document,
      }, { transaction: t });

      // Calcular e criar parcelas
      const installmentValue = message.amount / message.numInstallments;

      for (let i = 1; i <= message.numInstallments; i++) {
        await Installment.create({
          id: Sequelize.fn('uuid_generate_v4'),
          transactionId: transaction.id,
          installmentNumber: i,
          value: installmentValue,
        }, { transaction: t });
      }

      // Confirmar a transação Sequelize
      await t.commit();

      console.log(`Mensagem processada: ${msg.content.toString()}`);
    } catch (error) {
      // Reverter a transação em caso de erro
      await t.rollback();
      console.error('Erro ao processar mensagem:', error);
    }
  }, { noAck: true });
}

consumeMessages();

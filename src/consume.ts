import * as amqp from 'amqplib';
import { sequelize } from './database';
import { Installment, Person, Transaction } from './models';
import { InstallmentAttributes } from './models/installment';

// Consumir mensagens
async function consumeMessages(): Promise<void> {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'transactions_queue';
  await channel.assertQueue(queue, { durable: false });

  console.log('Aguardando mensagens...');

  channel.consume(
    queue,
    async msg => {
      if (!msg) {
        return;
      }
      try {
        const message = JSON.parse(msg.content.toString());

        //console.log(message); // Console para verificar se estão chegando os dados
        // // Iniciar uma transação Sequelize
        const t = await sequelize.transaction();

        try {
          // Verificar se a pessoa já existe na tabela Person
          let person = await Person.findOne({
            where: { id: message.id + 1 },
          });

          // Se não existir, criar uma nova pessoa
          if (!person) {
            person = await Person.create(
              {
                id: message.document,
                name: message.name,
                age: message.age,
              },
              { transaction: t }
            );
          }

          // // Criar uma nova transação
          // const transaction = await Transaction.create(
          //   {
          //     id: message.transactionId,
          //     transactionDate: message.transactionDate,
          //     amount: message.amount,
          //     personid: message.document,
          //   },
          //   { transaction: t }
          // );

          // // Calcular e criar parcelas
          // const installmentValue = message.amount / message.numInstallments;

          // for (let i = 1; i <= message.numInstallments; i++) {
          //   const installment = {
          //     id: sequelize.fn('uuid_generate_v4') as unknown as string, // Converte o tipo para string
          //     transactionId: transaction.id,
          //     installmentNumber: i,
          //     value: installmentValue,
          //   };

          //   // Converta o objeto `installment` para uma versão comum antes de criar
          //   await Installment.create(
          //     installment as unknown as InstallmentAttributes,
          //     {
          //       transaction: t,
          //     }
          //   );
          // }

          // Confirmar a transação Sequelize
          await t.commit();

          console.log(`Mensagem processada: ${msg.content.toString()}`);
        } catch (error) {
          // Reverter a transação em caso de erro
          await t.rollback();
          console.error('Erro ao processar mensagem:', error);
        }
      } catch (error) {
        console.error('Erro ao fazer parse da mensagem JSON:', error);
      }
    },
    { noAck: true }
  );
}

export default consumeMessages;

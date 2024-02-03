import * as amqp from 'amqplib'
import Person from './models/person'
import Transaction from './models/transaction'
import Installment from './models/installment'
import { Sequelize, type Transaction as SequelizeTransaction } from 'sequelize'

import sequelize from '../config/sequelize'

interface Message {
  document: string
  name: string
  age: number
  transactionId: string
  transactionDate: string
  amount: number
  numInstallments: number
}

interface TransactionResult {
  id: string
  transactionDate: string
  amount: number
  numInstallments: number
  personId: string
}

interface InstallmentResult {
  id: string
  transactionId: string
  installmentNumber: number
  value: number
}

/**
 * Consume messages from the queue and process them.
 * @returns Promise<void>
 */
async function consumeMessages (): Promise<void> {
  const connection: amqp.Connection = await amqp.connect('amqp://localhost')
  const channel: amqp.Channel = await connection.createChannel()

  const queue: string = 'transactions_queue'
  await channel.assertQueue(queue, { durable: false })

  console.log('Aguardando mensagens...')

  // Consumir mensagens da fila
  channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
    if (!msg) {
      return
    }

    const message: Message = JSON.parse(msg.content.toString())

    // Iniciar uma transação Sequelize
    const t: SequelizeTransaction = await sequelize.transaction()

    try {
      // Verificar se a pessoa já existe na tabela Person
      let person: Person | null = await Person.findOne({ where: { document: message.document } })

      // Se não existir, criar uma nova pessoa
      if (!person) {
        person = await Person.create({
          document: message.document,
          name: message.name,
          age: message.age
        }, { transaction: t })
      }

      // Criar uma nova transação
      const transaction: TransactionResult = await Transaction.create({
        id: message.transactionId,
        transactionDate: message.transactionDate,
        amount: message.amount,
        numInstallments: message.numInstallments,
        personId: person.document
      }, { transaction: t })

      // Calcular e criar parcelas
      const installmentValue: number = message.amount / message.numInstallments

      for (let i: number = 1; i <= message.numInstallments; i++) {
        await Installment.create({
          id: Sequelize.fn('uuid_generate_v4'),
          transactionId: transaction.id,
          installmentNumber: i,
          value: installmentValue
        }, { transaction: t })
      }

      // Confirmar a transação Sequelize
      await t.commit()

      console.log(`Mensagem processada: ${msg.content.toString()}`)
    } catch (error) {
      // Reverter a transação em caso de erro
      await t.rollback()
      console.error('Erro ao processar mensagem:', error)
    }
  }, { noAck: true })
}

consumeMessages()

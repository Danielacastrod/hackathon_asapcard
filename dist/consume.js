"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib"));
const person_1 = __importDefault(require("./models/person"));
const transaction_1 = __importDefault(require("./models/transaction"));
const installment_1 = __importDefault(require("./models/installment"));
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
/**
 * Consume messages from the queue and process them.
 * @returns Promise<void>
 */
function consumeMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield amqp.connect('amqp://localhost');
        const channel = yield connection.createChannel();
        const queue = 'transactions_queue';
        yield channel.assertQueue(queue, { durable: false });
        console.log('Aguardando mensagens...');
        // Consumir mensagens da fila
        channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
            if (!msg) {
                return;
            }
            const message = JSON.parse(msg.content.toString());
            // Iniciar uma transação Sequelize
            const t = yield sequelize_2.default.transaction();
            try {
                // Verificar se a pessoa já existe na tabela Person
                let person = yield person_1.default.findOne({ where: { document: message.document } });
                // Se não existir, criar uma nova pessoa
                if (!person) {
                    person = yield person_1.default.create({
                        document: message.document,
                        name: message.name,
                        age: message.age
                    }, { transaction: t });
                }
                // Criar uma nova transação
                const transaction = yield transaction_1.default.create({
                    id: message.transactionId,
                    transactionDate: message.transactionDate,
                    amount: message.amount,
                    numInstallments: message.numInstallments,
                    personId: person.document
                }, { transaction: t });
                // Calcular e criar parcelas
                const installmentValue = message.amount / message.numInstallments;
                for (let i = 1; i <= message.numInstallments; i++) {
                    yield installment_1.default.create({
                        id: sequelize_1.Sequelize.fn('uuid_generate_v4'),
                        transactionId: transaction.id,
                        installmentNumber: i,
                        value: installmentValue
                    }, { transaction: t });
                }
                // Confirmar a transação Sequelize
                yield t.commit();
                console.log(`Mensagem processada: ${msg.content.toString()}`);
            }
            catch (error) {
                // Reverter a transação em caso de erro
                yield t.rollback();
                console.error('Erro ao processar mensagem:', error);
            }
        }), { noAck: true });
    });
}
consumeMessages();

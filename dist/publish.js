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
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const amqp = __importStar(require("amqplib"));
/**
 * Reads a CSV file, parses its rows, and publishes each row as a message to a RabbitMQ queue.
 */
function publishMessages() {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = [];
        // Reading the CSV file
        fs.createReadStream('input-data.csv')
            .pipe((0, csv_parser_1.default)({ separator: ';' }))
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
            .on('end', () => __awaiter(this, void 0, void 0, function* () {
            // Connecting to RabbitMQ
            const connection = yield amqp.connect('amqp://localhost');
            const channel = yield connection.createChannel();
            // Declaring a queue for the messages
            const queue = 'transactions_queue';
            yield channel.assertQueue(queue, { durable: false });
            // Publishing each message to the queue
            messages.forEach((message) => {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            });
            console.log('Messages published to RabbitMQ');
            // Closing the connection
            yield channel.close();
            yield connection.close();
        }));
    });
}
publishMessages();

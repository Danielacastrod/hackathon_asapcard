"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
const { UUID, UUIDV4, INTEGER, FLOAT } = sequelize_1.DataTypes;
const Installment = database_1.sequelize.define('Installment', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    transactionId: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: 'Transaction', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    installmentNumber: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    value: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
});
exports.default = Installment;

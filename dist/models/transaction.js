"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
const Transaction = database_1.sequelize.define('Transaction', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    personid: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: 'Installment', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    InstallmentDate: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
    amount: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
});
exports.default = Transaction;

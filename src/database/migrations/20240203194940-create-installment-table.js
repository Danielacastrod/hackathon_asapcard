'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('installment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      transaction_id: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: { model: 'transaction', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      installment_number: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      value: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction');
  },
};

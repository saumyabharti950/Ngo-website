"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_gateways", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      provider: { type: Sequelize.STRING, allowNull: false },
      mode: { type: Sequelize.STRING, allowNull: false, defaultValue: "test" },
      public_key: { type: Sequelize.STRING, allowNull: false },
      secret_key: { type: Sequelize.TEXT, allowNull: false },
      active_slot: { type: Sequelize.INTEGER, allowNull: true, unique: true },
      created_at: Sequelize.DATE, updated_at: Sequelize.DATE, deleted_at: Sequelize.DATE
    });
    await queryInterface.addColumn("donations", "gateway_id", { type: Sequelize.INTEGER, references: { model: "payment_gateways", key: "id" } });
    await queryInterface.addColumn("donations", "gateway_order_id", { type: Sequelize.STRING, unique: true });
    await queryInterface.addColumn("donations", "gateway_payment_id", { type: Sequelize.STRING, unique: true });
    await queryInterface.addColumn("donations", "gateway_credentials", { type: Sequelize.TEXT });
  },
  async down(queryInterface) {
    for (const column of ["gateway_credentials", "gateway_payment_id", "gateway_order_id", "gateway_id"]) await queryInterface.removeColumn("donations", column);
    await queryInterface.dropTable("payment_gateways");
  }
};

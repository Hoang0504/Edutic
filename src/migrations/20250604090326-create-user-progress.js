"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserProgresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      listening_score: {
        type: Sequelize.INTEGER,
      },
      reading_score: {
        type: Sequelize.INTEGER,
      },
      speaking_score: {
        type: Sequelize.INTEGER,
      },
      writing_score: {
        type: Sequelize.INTEGER,
      },
      total_study_time: {
        type: Sequelize.INTEGER,
      },
      last_activity_date: {
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserProgresses");
  },
};

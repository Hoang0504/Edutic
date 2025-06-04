"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AiGeneratedContents", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content_type: {
        type: Sequelize.ENUM("question", "part", "exam", "vocabulary"),
      },
      content_id: {
        type: Sequelize.STRING,
      },
      generated_text: {
        type: Sequelize.TEXT,
      },
      prompt_used: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AiGeneratedContents");
  },
};

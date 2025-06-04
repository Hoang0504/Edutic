"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SpeakingWritingPrompts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      topic: {
        type: Sequelize.STRING,
      },
      skill_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Skills",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      description: {
        type: Sequelize.TEXT,
      },
      difficulty_level: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SpeakingWritingPrompts");
  },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vocabularies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      word: {
        type: Sequelize.STRING,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      pronunciation: {
        type: Sequelize.STRING,
      },
      speech_audio_url: {
        type: Sequelize.STRING,
      },
      meaning: {
        type: Sequelize.TEXT,
      },
      example: {
        type: Sequelize.TEXT,
      },
      context: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Vocabularies");
  },
};

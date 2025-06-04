"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AiFeedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content_type: {
        type: Sequelize.ENUM(
          "voice_recording",
          "writing_submission",
          "exam_attempt"
        ),
      },
      content_id: {
        type: Sequelize.INTEGER,
      },
      feedback_text: {
        type: Sequelize.TEXT,
      },
      suggestions: {
        type: Sequelize.TEXT,
      },
      strengths: {
        type: Sequelize.TEXT,
      },
      weaknesses: {
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
    await queryInterface.dropTable("AiFeedbacks");
  },
};

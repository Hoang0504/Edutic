"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSettings", {
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
      pomodoro_work_time: {
        type: Sequelize.INTEGER,
      },
      pomodoro_break_time: {
        type: Sequelize.INTEGER,
      },
      ui_theme: {
        type: Sequelize.ENUM("light", "dark", "system"),
      },
      study_music_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "StudyMusics", // ✅ table name must match
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      notification_settings: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable("UserSettings");
  },
};

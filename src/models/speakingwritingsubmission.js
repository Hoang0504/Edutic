"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpeakingWritingSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.SpeakingWritingPrompt, {
        foreignKey: "prompt_id",
        as: "prompt",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.AiFeedback, {
        foreignKey: "ai_feedback_id",
        as: "aiFeedback",
        onDelete: "SET NULL",
      });
    }
  }
  SpeakingWritingSubmission.init(
    {
      user_id: DataTypes.INTEGER,
      prompt_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      file_path: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      ai_feedback_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SpeakingWritingSubmission",
      timestamps: false,
    }
  );
  return SpeakingWritingSubmission;
};

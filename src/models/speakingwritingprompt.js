"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpeakingWritingPrompt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Skill, {
        foreignKey: "skill_id",
        as: "skill",
        onDelete: "CASCADE",
      });
      this.hasMany(models.SpeakingWritingSubmission, {
        foreignKey: "prompt_id",
        as: "submissions",
        onDelete: "CASCADE",
      });
    }
  }
  SpeakingWritingPrompt.init(
    {
      topic: DataTypes.STRING,
      skill_id: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      difficulty_level: DataTypes.ENUM("easy", "medium", "hard"),
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "SpeakingWritingPrompt",
      timestamps: false,
    }
  );
  return SpeakingWritingPrompt;
};

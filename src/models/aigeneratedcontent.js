"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AiGeneratedContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AiGeneratedContent.init(
    {
      content_type: DataTypes.ENUM("question", "part", "exam", "vocabulary"),
      content_id: DataTypes.STRING,
      generated_text: DataTypes.TEXT,
      prompt_used: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AiGeneratedContent",
      timestamps: false,
    }
  );
  return AiGeneratedContent;
};

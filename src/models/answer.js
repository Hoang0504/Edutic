"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.belongsTo(models.Question, {
        foreignKey: "question_id",
        as: "question",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Answer.hasMany(models.UserAnswer, {
        foreignKey: "answer_id",
        as: "user_answers",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  Answer.init(
    {
      question_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      is_correct: DataTypes.BOOLEAN,
      explanation: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Answer",
      timestamps: false,
    }
  );
  return Answer;
};

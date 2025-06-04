"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.UserExamAttempt, {
        foreignKey: "user_exam_attempt_id",
        as: "exam_attempt",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Question, {
        foreignKey: "question_id",
        as: "question",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Answer, {
        foreignKey: "answer_id",
        as: "answer",
        onDelete: "SET NULL",
      });
    }
  }
  UserAnswer.init(
    {
      user_exam_attempt_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      answer_id: DataTypes.INTEGER,
      user_text_answer: DataTypes.TEXT,
      is_correct: DataTypes.BOOLEAN,
      time_spent: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserAnswer",
      timestamps: false,
    }
  );
  return UserAnswer;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserExamAttempt extends Model {
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

      this.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
        onDelete: "CASCADE",
      });
      this.hasMany(models.UserAnswer, {
        foreignKey: "user_exam_attempt_id",
        as: "user_answers",
        onDelete: "CASCADE",
      });
    }
  }
  UserExamAttempt.init(
    {
      user_id: DataTypes.INTEGER,
      exam_id: DataTypes.INTEGER,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      score: DataTypes.INTEGER,
      status: DataTypes.ENUM("in_progress", "completed", "abandoned"),
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserExamAttempt",
      timestamps: false,
    }
  );
  return UserExamAttempt;
};

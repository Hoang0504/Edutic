"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Part, { foreignKey: "exam_id", as: "parts" });
      this.hasMany(models.UserExamAttempt, {
        foreignKey: "exam_id",
        as: "attempts",
      });
    }
  }
  Exam.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      difficulty_level: DataTypes.ENUM("easy", "medium", "hard"),
      estimated_time: DataTypes.INTEGER,
      is_published: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Exam",
      timestamps: false,
    }
  );
  return Exam;
};

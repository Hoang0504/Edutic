"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Part, {
        foreignKey: "part_id",
        as: "part",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Answer, {
        foreignKey: "question_id",
        as: "answers",
      });
      this.hasMany(models.UserAnswer, {
        foreignKey: "question_id",
        as: "user_answers",
        onDelete: "CASCADE",
      });
    }
  }
  Question.init(
    {
      part_id: DataTypes.INTEGER,
      question_number: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      question_type: DataTypes.ENUM(
        "multiple_choice",
        "fill_in_blank",
        "matching",
        "speaking",
        "writing"
      ),
      image_url: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Question",
      timestamps: false,
    }
  );
  return Question;
};

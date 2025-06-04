"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flashcard extends Model {
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
      this.belongsTo(models.Vocabulary, {
        foreignKey: "vocabulary_id",
        as: "vocabulary",
        onDelete: "CASCADE",
      });
    }
  }
  Flashcard.init(
    {
      user_id: DataTypes.INTEGER,
      vocabulary_id: DataTypes.INTEGER,
      mastery_level: DataTypes.INTEGER,
      next_review_date: DataTypes.DATE,
      review_count: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Flashcard",
      timestamps: false,
    }
  );
  return Flashcard;
};

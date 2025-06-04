"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vocabulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Flashcard, {
        foreignKey: "vocabulary_id",
        as: "flashcards",
      });
    }
  }
  Vocabulary.init(
    {
      word: DataTypes.STRING,
      image_url: DataTypes.STRING,
      pronunciation: DataTypes.STRING,
      speech_audio_url: DataTypes.STRING,
      meaning: DataTypes.TEXT,
      example: DataTypes.TEXT,
      context: DataTypes.STRING,
      status: DataTypes.ENUM("pending", "approved", "rejected"),
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Vocabulary",
      timestamps: false,
    }
  );
  return Vocabulary;
};

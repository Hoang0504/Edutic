"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Translation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Translation.init(
    {
      content_type: DataTypes.ENUM(
        "question",
        "answer",
        "instruction",
        "transcript"
      ),
      content_id: DataTypes.INTEGER,
      english_text: DataTypes.TEXT,
      vietnamese_text: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Translation",
      timestamps: false,
    }
  );
  return Translation;
};

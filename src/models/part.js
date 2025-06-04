"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Part extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Question, {
        foreignKey: "part_id",
        as: "notifications",
      });
      this.hasMany(models.AudioFile, {
        foreignKey: "part_id",
        as: "notifications",
      });
    }
  }
  Part.init(
    {
      exam_id: DataTypes.INTEGER,
      part_number: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      instruction: DataTypes.TEXT,
      time_limit: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Part",
      timestamps: false,
    }
  );
  return Part;
};

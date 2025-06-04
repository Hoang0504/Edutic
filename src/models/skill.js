"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.SpeakingWritingPrompt, {
        foreignKey: "skill_id",
        as: "skills",
      });
      this.hasMany(models.UserSkill, {
        foreignKey: "skill_id",
        as: "skills",
      });
    }
  }
  Skill.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Skill",
      timestamps: false,
    }
  );
  return Skill;
};

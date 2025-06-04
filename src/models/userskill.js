"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSkill extends Model {
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
      this.belongsTo(models.Skill, {
        foreignKey: "skill_id",
        as: "skill",
        onDelete: "CASCADE",
      });
    }
  }
  UserSkill.init(
    {
      user_id: DataTypes.INTEGER,
      skill_id: DataTypes.INTEGER,
      type: DataTypes.ENUM("strong", "weak"),
    },
    {
      sequelize,
      modelName: "UserSkill",
      timestamps: false,
    }
  );
  return UserSkill;
};

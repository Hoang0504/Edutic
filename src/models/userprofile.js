"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
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
      });
    }
  }
  UserProfile.init(
    {
      user_id: DataTypes.INTEGER,
      target_score: DataTypes.INTEGER,
      study_time_preference: DataTypes.INTEGER,
      level: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserProfile",
      timestamps: false,
    }
  );
  return UserProfile;
};

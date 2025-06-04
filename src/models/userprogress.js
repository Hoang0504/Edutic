"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProgress extends Model {
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
    }
  }
  UserProgress.init(
    {
      user_id: DataTypes.INTEGER,
      listening_score: DataTypes.INTEGER,
      reading_score: DataTypes.INTEGER,
      speaking_score: DataTypes.INTEGER,
      writing_score: DataTypes.INTEGER,
      total_study_time: DataTypes.INTEGER,
      last_activity_date: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserProgress",
      timestamps: false,
    }
  );
  return UserProgress;
};

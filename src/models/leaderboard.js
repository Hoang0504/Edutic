"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Leaderboard extends Model {
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
  Leaderboard.init(
    {
      user_id: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
      period_type: DataTypes.ENUM("weekly", "monthly", "all_time"),
      period_start_date: DataTypes.DATE,
      rank: DataTypes.INTEGER,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Leaderboard",
      timestamps: false,
    }
  );
  return Leaderboard;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudySession extends Model {
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
  StudySession.init(
    {
      user_id: DataTypes.INTEGER,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      duration: DataTypes.INTEGER,
      activity_type: DataTypes.ENUM(
        "exam",
        "flashcard",
        "listening",
        "reading",
        "speaking",
        "writing"
      ),
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "StudySession",
      timestamps: false,
    }
  );
  return StudySession;
};

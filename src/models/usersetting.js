"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      this.belongsTo(models.StudyMusic, {
        foreignKey: "study_music_id",
        as: "music",
      });
    }
  }
  UserSetting.init(
    {
      user_id: DataTypes.INTEGER,
      pomodoro_work_time: DataTypes.INTEGER,
      pomodoro_break_time: DataTypes.INTEGER,
      ui_theme: DataTypes.ENUM("light", "dark", "system"),
      study_music_id: DataTypes.INTEGER,
      notification_settings: DataTypes.JSON,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserSetting",
      timestamps: false,
    }
  );
  return UserSetting;
};

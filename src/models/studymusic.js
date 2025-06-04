"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudyMusic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UserSetting, {
        foreignKey: "study_music_id",
        as: "user_settings",
      });
    }
  }
  StudyMusic.init(
    {
      title: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      file_url: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "StudyMusic",
      timestamps: false,
    }
  );
  return StudyMusic;
};

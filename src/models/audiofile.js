"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AudioFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Part, {
        foreignKey: "part_id",
        as: "part",
        onDelete: "CASCADE",
      });
    }
  }
  AudioFile.init(
    {
      part_id: DataTypes.INTEGER,
      file_path: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      transcript: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AudioFile",
      timestamps: false,
    }
  );
  return AudioFile;
};

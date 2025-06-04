"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AiFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.SpeakingWritingSubmission, {
        foreignKey: "ai_feedback_id",
        as: "submissions",
        onDelete: "SET NULL",
      });
    }
  }
  AiFeedback.init(
    {
      content_type: DataTypes.ENUM(
        "voice_recording",
        "writing_submission",
        "exam_attempt"
      ),
      content_id: DataTypes.INTEGER,
      feedback_text: DataTypes.TEXT,
      suggestions: DataTypes.TEXT,
      strengths: DataTypes.TEXT,
      weaknesses: DataTypes.TEXT,
      created_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AiFeedback",
      timestamps: false,
    }
  );
  return AiFeedback;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.UserProfile, {
        foreignKey: "user_id",
        as: "profile",
        onDelete: "CASCADE",
      });
      this.hasOne(models.UserSetting, {
        foreignKey: "user_id",
        as: "setting",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Flashcard, {
        foreignKey: "user_id",
        as: "flashcards",
      });
      this.hasOne(models.UserProgress, {
        foreignKey: "user_id",
        as: "progress",
        onDelete: "CASCADE",
      });
      this.hasOne(models.UserProgress, {
        foreignKey: "user_id",
        as: "progress",
        onDelete: "CASCADE",
      });
      this.hasOne(models.ApiUsage, {
        foreignKey: "user_id",
        as: "api_usage",
        onDelete: "CASCADE",
      });
      this.hasMany(models.UserExamAttempt, {
        foreignKey: "user_id",
        as: "exam_attempts",
      });
      this.hasMany(models.StudySession, {
        foreignKey: "user_id",
        as: "study_sessions",
      });
      this.hasMany(models.UserSkill, {
        foreignKey: "user_id",
        as: "skills",
      });
      this.hasMany(models.SpeakingWritingSubmission, {
        foreignKey: "user_id",
        as: "submissions",
      });
      this.hasOne(models.Leaderboard, {
        foreignKey: "user_id",
        as: "leaderboards",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      is_email_verified: DataTypes.BOOLEAN,
      auth_provider: DataTypes.ENUM("email", "google"),
      auth_provider_id: DataTypes.STRING,
      role: DataTypes.ENUM("student", "teacher", "admin"),
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      last_login: DataTypes.DATE,
      verification_token: DataTypes.STRING,
      verification_token_expires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};

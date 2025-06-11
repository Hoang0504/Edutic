import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import { User } from "@/models/User";
import { Flashcard } from "@/models/Flashcard";
import { UserProfile } from "@/models/UserProfile";
import { Vocabulary } from "@/models/Vocabulary";
import { Feedback } from "@/models/Feedback";
import { AIGeneratedContent } from "@/models/AIGeneratedContent";
import { Question } from "@/models/Question";
import { Answer } from "@/models/Answer";
import { AIFeedback } from "@/models/AIFeedback";
import { ApiUsage } from "@/models/ApiUsage";
import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { Skill } from "@/models/Skill";
import { SpeakingWritingPrompt } from "@/models/SpeakingWritingPrompt";
import { SpeakingWritingSubmission } from "@/models/SpeakingWritingSubmission";
import { StudyMusic } from "@/models/StudyMusic";
import { StudySession } from "@/models/StudySession";
import { UserAnswer } from "@/models/UserAnswer";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { UserProgress } from "@/models/UserProgress";
import { UserSetting } from "@/models/UserSetting";
import { LeaderBoard } from "@/models/LeaderBoard";
import { AudioFile } from "@/models/AudioFile";
import { Translation } from "@/models/Translation";

export const sequelize = new Sequelize({
  dialect: "mysql",
  timezone: "+07:00",
  host: process.env.DB_HOST!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  models: [
    AIFeedback,
    AIGeneratedContent,
    Answer,
    ApiUsage,
    AudioFile,
    Exam,
    Feedback,
    Flashcard,
    LeaderBoard,
    Part,
    Question,
    Skill,
    SpeakingWritingPrompt,
    SpeakingWritingSubmission,
    StudyMusic,
    StudySession,
    Translation,
    User,
    UserAnswer,
    UserExamAttempt,
    UserProfile,
    UserProgress,
    UserSetting,
    Vocabulary,
  ],
  logging: false,
});

// User.hasOne(UserProfile, { foreignKey: "user_id" });
// UserProfile.belongsTo(User, { foreignKey: "user_id" });

// User.hasOne(UserSetting, { foreignKey: "user_id" });
// UserSetting.belongsTo(User, { foreignKey: "user_id" });

// User.hasMany(SpeakingWritingSubmission, {
//   foreignKey: "user_id",
//   as: "speaking_writing_submissions",
// });
// SpeakingWritingSubmission.belongsTo(User, {
//   foreignKey: "user_id",
// });

// User.hasMany(LeaderBoard, { foreignKey: "user_id" });
// LeaderBoard.belongsTo(User, { foreignKey: "user_id" });

// User.hasMany(Flashcard, { foreignKey: "user_id" });
// Flashcard.belongsTo(User, { foreignKey: "user_id" });

// User.hasMany(Feedback, { foreignKey: "user_id" });
// Feedback.belongsTo(User, { foreignKey: "user_id" });

// User.hasMany(UserExamAttempt, { foreignKey: "user_id" });
// UserExamAttempt.belongsTo(User, { foreignKey: "user_id" });

// User.hasOne(UserProgress, { foreignKey: "user_id" });
// UserProgress.belongsTo(User, { foreignKey: "user_id" });

// User.hasOne(ApiUsage, { foreignKey: "user_id" });
// ApiUsage.belongsTo(User, { foreignKey: "user_id" });

// Question.hasMany(Answer, { foreignKey: "question_id" });
// Answer.belongsTo(Question, { foreignKey: "question_id" });

// Answer.hasMany(UserAnswer, { foreignKey: "answer_id" });
// UserAnswer.belongsTo(Answer, { foreignKey: "answer_id" });

// Part.hasMany(AudioFile, { foreignKey: "part_id" });
// AudioFile.belongsTo(Part, { foreignKey: "part_id" });

// UserExamAttempt.hasMany(UserAnswer, { foreignKey: "user_exam_attempt_id" });
// UserAnswer.belongsTo(UserExamAttempt, { foreignKey: "user_exam_attempt_id" });

// Exam.hasMany(UserExamAttempt, { foreignKey: "exam_id" });
// UserExamAttempt.belongsTo(Exam, { foreignKey: "exam_id" });

// UserSetting.hasOne(StudyMusic, { foreignKey: "user_id" });
// StudyMusic.belongsTo(UserSetting, {
//   foreignKey: "user_id",
//   as: "user_setting",
// });

// Part.hasMany(Exam, { foreignKey: "part_id" });
// Exam.belongsTo(Part, { foreignKey: "part_id" });

// Part.hasMany(Question, { foreignKey: "part_id" });
// Question.belongsTo(Part, { foreignKey: "part_id" });

// Vocabulary.hasMany(Flashcard, { foreignKey: "vocabulary_id" });
// Flashcard.belongsTo(Vocabulary, { foreignKey: "vocabulary_id" });

// Question.hasMany(UserAnswer, { foreignKey: "question_id" });
// UserAnswer.belongsTo(Question, { foreignKey: "question_id" });

// SpeakingWritingPrompt.hasMany(SpeakingWritingSubmission, {
//   foreignKey: "prompt_id",
// });
// SpeakingWritingSubmission.belongsTo(SpeakingWritingPrompt, {
//   foreignKey: "prompt_id",
// });

// Skill.hasMany(SpeakingWritingPrompt, { foreignKey: "skill_id" });
// SpeakingWritingPrompt.belongsTo(Skill, { foreignKey: "skill_id" });

// AIGeneratedContent.belongsTo(User, { foreignKey: "user_id" });
// User.hasMany(AIGeneratedContent, { foreignKey: "user_id" });

export {
  AIFeedback,
  AIGeneratedContent,
  Answer,
  ApiUsage,
  AudioFile,
  Exam,
  Feedback,
  Flashcard,
  LeaderBoard,
  Part,
  Question,
  Skill,
  SpeakingWritingPrompt,
  SpeakingWritingSubmission,
  StudyMusic,
  StudySession,
  Translation,
  User,
  UserAnswer,
  UserExamAttempt,
  UserProfile,
  UserProgress,
  UserSetting,
  Vocabulary,
};

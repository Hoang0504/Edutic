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
import { ExamPart } from "@/models/ExamPart";
import { UserAttemptPart } from "@/models/UserAttemptPart";
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
import { QuestionGroup } from "@/models/QuestionGroup";
import { UserTargetSkill } from "@/models/UserTargetSkill";

const sequelize = new Sequelize({
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
    ExamPart,
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
    UserAttemptPart,
    UserExamAttempt,
    UserProfile,
    UserProgress,
    UserSetting,
    Vocabulary,
    QuestionGroup,
    UserTargetSkill,
  ],
  logging: false,
});

export default sequelize;

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import type { UserProfile as UserProfileType } from "./UserProfile";
import type { UserTargetSkill as UserTargetSkillType } from "./UserTargetSkill";
import type { UserSetting as UserSettingType } from "./UserSetting";
import type { Flashcard as FlashcardType } from "./Flashcard";
import type { UserProgress as UserProgressType } from "./UserProgress";
import type { ApiUsage as ApiUsageType } from "./ApiUsage";
import type { UserExamAttempt as UserExamAttemptType } from "./UserExamAttempt";
import type { StudySession as StudySessionType } from "./StudySession";
import type { SpeakingWritingSubmission as SpeakingWritingSubmissionType } from "./SpeakingWritingSubmission";
import type { LeaderBoard as LeaderBoardType } from "./LeaderBoard";

interface UserCreationAttributes {
  id?: number;
  email: string;
  password_hash: string;
  name?: string;
  avatar?: string | null; // Có thể null
  is_email_verified?: boolean;
  auth_provider?: "email" | "google";
  auth_provider_id?: string | null; // Có thể null
  created_at?: Date;
  role?: "user" | "admin";
  uuid?: string; // UUID cho người dùng
  updated_at?: Date;
  last_login?: Date | null; // Có thể null
}

@Table({ tableName: "users", timestamps: false })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password_hash!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  avatar!: string | null; 

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_email_verified!: boolean;

  @Column({ type: DataType.ENUM("email", "google"), defaultValue: "email" })
  auth_provider!: string;

  @Column(DataType.STRING)
  auth_provider_id!: string;

  @Column({ type: DataType.ENUM('student', 'admin'), defaultValue: "admin" })
  role!: string;

  @Column(DataType.STRING)
  uuid!: string; // UUID cho người dùng

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @Column(DataType.DATE)
  last_login!: Date;

  @HasOne(() => require("./UserProfile").UserProfile)
  profile!: UserProfileType;

  @HasMany(() => require("./UserTargetSkill").UserTargetSkill)
  target_skills!: UserTargetSkillType[];

  @HasOne(() => require("./UserSetting").UserSetting)
  user_setting!: UserSettingType;

  @HasMany(() => require("./Flashcard").Flashcard)
  flashcards!: FlashcardType[];

  @HasOne(() => require("./UserProgress").UserProgress)
  user_progress!: UserProgressType;

  @HasMany(() => require("./ApiUsage").ApiUsage)
  api_usages!: ApiUsageType[];

  @HasMany(() => require("./UserExamAttempt").UserExamAttempt)
  user_exam_attempts!: UserExamAttemptType[];

  @HasOne(() => require("./StudySession").StudySession)
  study_session!: StudySessionType;

  @HasMany(
    () => require("./SpeakingWritingSubmission").SpeakingWritingSubmission
  )
  speaking_writing_submissions!: SpeakingWritingSubmissionType[];

  @HasMany(() => require("./LeaderBoard").LeaderBoard)
  leader_boards!: LeaderBoardType[];
}

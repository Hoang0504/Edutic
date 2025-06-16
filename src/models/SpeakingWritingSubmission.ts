import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { SpeakingWritingPrompt } from "./SpeakingWritingPrompt";
import { AIFeedback } from "./AIFeedback";
import type { User as UserType } from "./User";
import type { SpeakingWritingPrompt as SpeakingWritingPromptType } from "./SpeakingWritingPrompt";
import type { AIFeedback as AIFeedbackType } from "./AIFeedback";

interface SpeakingWritingSubmissionCreationAttributes {
  id?: number;
  user_id: number;
  prompt_id: number;
  content?: string | null;
  file_path?: string | null;
  duration?: number | null;
  ai_feedback_id: number;
  score: number;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "speaking_writing_submissions", timestamps: false })
export class SpeakingWritingSubmission extends Model<
  SpeakingWritingSubmission,
  SpeakingWritingSubmissionCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => SpeakingWritingPrompt)
  @Column(DataType.INTEGER)
  prompt_id!: number;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.STRING)
  file_path!: string;

  @Column(DataType.INTEGER)
  duration!: number;

  @ForeignKey(() => AIFeedback)
  @Column(DataType.INTEGER)
  ai_feedback_id!: number;

  @Column(DataType.INTEGER)
  score!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => require("./User").User)
  user!: UserType;

  @BelongsTo(() => require("./SpeakingWritingPrompt").SpeakingWritingPrompt)
  prompt!: SpeakingWritingPromptType;

  @BelongsTo(() => require("./AIFeedback").AIFeedback)
  feedback!: AIFeedbackType;
}

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

@Table({ tableName: "speaking_writing_submissions", timestamps: false })
export class SpeakingWritingSubmission extends Model<SpeakingWritingSubmission> {
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

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => SpeakingWritingPrompt)
  prompt!: SpeakingWritingPrompt;

  @BelongsTo(() => AIFeedback)
  feedback!: AIFeedback;
}

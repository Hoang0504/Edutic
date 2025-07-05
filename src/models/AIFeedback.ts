import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

export interface AIFeedbackContentAttributes {
  id?: number;
  content_type:
    | "speaking_submission"
    | "writing_submission"
    | "user_attempt_part";
  content_id: number;
  feedback_text: string;
  suggestions?: string;
  strengths?: string;
  weaknesses?: string;
  created_at?: Date;
}

@Table({ tableName: "ai_feedbacks", timestamps: false })
export class AIFeedback extends Model<AIFeedback, AIFeedbackContentAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.ENUM(
      "speaking_submission",
      "writing_submission",
      "user_attempt_part"
    ),
    allowNull: false,
  })
  content_type!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  content_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  feedback_text!: string;

  @Column(DataType.TEXT)
  suggestions!: string;

  @Column(DataType.TEXT)
  strengths!: string;

  @Column(DataType.TEXT)
  weaknesses!: string;

  @Column(DataType.DATE)
  created_at!: Date;
}

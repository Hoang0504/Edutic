import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ tableName: "ai_feedbacks", timestamps: false })
export class AIFeedback extends Model<AIFeedback> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.ENUM(
      "speaking_submission",
      "writing_submission",
      "exam_attempt"
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

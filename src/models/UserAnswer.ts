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
import { UserExamAttempt } from "./UserExamAttempt";
import { Question } from "./Question";
import { Answer } from "./Answer";

@Table({ tableName: "user_answers", timestamps: false })
export class UserAnswer extends Model<UserAnswer> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => UserExamAttempt)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_exam_attempt_id!: number;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  question_id!: number;

  @ForeignKey(() => Answer)
  @Column(DataType.INTEGER)
  answer_id!: number;

  @Column(DataType.TEXT)
  user_text_answer!: string;

  @Column(DataType.BOOLEAN)
  is_correct!: boolean;

  @Column(DataType.INTEGER)
  time_spent!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => UserExamAttempt)
  attempt!: UserExamAttempt;

  @BelongsTo(() => Question)
  question!: Question;

  @BelongsTo(() => Answer)
  answer!: Answer;
}

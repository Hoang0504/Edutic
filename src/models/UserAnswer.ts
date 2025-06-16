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
import type { UserExamAttempt as UserExamAttemptType } from "./UserExamAttempt";
import type { Question as QuestionType } from "./Question";
import type { Answer as AnswerType } from "./Answer";

interface UserAnswerCreationAttributes {
  id?: number;
  user_exam_attempt_id: number;
  question_id: number;
  answer_id: number;
  user_text_answer: string;
  is_correct: boolean;
  created_at?: Date;
}

@Table({ tableName: "user_answers", timestamps: false })
export class UserAnswer extends Model<
  UserAnswer,
  UserAnswerCreationAttributes
> {
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

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./UserExamAttempt").UserExamAttempt)
  attempt!: UserExamAttemptType;

  @BelongsTo(() => require("./Question").Question)
  question!: QuestionType;

  @BelongsTo(() => require("./Answer").Answer)
  answer!: AnswerType;
}

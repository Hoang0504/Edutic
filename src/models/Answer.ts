import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Question } from "./Question";
import type { Question as QuestionType } from "./Question";
import type { UserAnswer as UserAnswerType } from "./UserAnswer";

interface AnswerCreationAttributes {
  id?: number; // Optional vì là auto-increment
  question_id: number;
  content: string;
  is_correct?: boolean; // Có defaultValue nên optional
  explanation?: string | null; // Chỉ mỗi trường này được phép null
  created_at?: Date; // Optional vì có thể tự động tạo
}

@Table({ tableName: "answers", timestamps: false })
export class Answer extends Model<Answer, AnswerCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  question_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_correct!: boolean;

  @Column(DataType.TEXT)
  explanation!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./Question").Question)
  question!: QuestionType;

  @HasMany(() => require("./UserAnswer").UserAnswer)
  user_answers!: UserAnswerType[];
}

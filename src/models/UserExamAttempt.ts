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
import { User } from "./User";
import { Exam } from "./Exam";
import type { User as UserType } from "./User";
import type { Exam as ExamType } from "./Exam";
import type { UserAnswer as UserAnswerType } from "./UserAnswer";
import type { UserAttemptPart as UserAttemptPartType } from "./UserAttemptPart";

interface UserExamAttemptCreationAttributes {
  id?: number;
  user_id: number;
  exam_id: number;
  start_time?: Date;
  end_time?: Date | null; // Can be null
  score?: number | null; // Can be null
  status?: "in_progress" | "completed" | "abandoned";
  created_at?: Date;
}

@Table({ tableName: "user_exam_attempts", timestamps: false })
export class UserExamAttempt extends Model<
  UserExamAttempt,
  UserExamAttemptCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => Exam)
  @Column({ type: DataType.INTEGER, allowNull: false })
  exam_id!: number;

  @Column({ type: DataType.DATE, allowNull: true })
  start_time!: Date;

  @Column(DataType.DATE)
  end_time!: Date;

  @Column(DataType.INTEGER)
  score!: number;

  @Column({
    type: DataType.ENUM("in_progress", "completed", "abandoned"),
    defaultValue: "in_progress",
  })
  status!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./User").User)
  user!: UserType;

  @BelongsTo(() => require("./Exam").Exam)
  exam!: ExamType;

  @HasMany(() => require("./UserAnswer").UserAnswer)
  answers!: UserAnswerType[];

  @HasMany(() => require("./UserAttemptPart").UserAttemptPart)
  attemptParts!: UserAttemptPartType[];
}

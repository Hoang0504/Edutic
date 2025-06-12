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
import { UserAnswer } from "./UserAnswer";
import { UserAttemptPart } from "./UserAttemptPart";

@Table({ tableName: "user_exam_attempts", timestamps: false })
export class UserExamAttempt extends Model<UserExamAttempt> {
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

  @Column({ type: DataType.DATE, allowNull: false })
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

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Exam)
  exam!: Exam;

  @HasMany(() => UserAnswer)
  answers!: UserAnswer[];

  @HasMany(() => UserAttemptPart)
  attemptParts!: UserAttemptPart[];
}

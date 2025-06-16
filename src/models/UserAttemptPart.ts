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
import { Part } from "./Part";
import type { UserExamAttempt as UserExamAttemptType } from "./UserExamAttempt";
import type { Part as PartType } from "./Part";

interface UserAttemptPartCreationAttributes {
  id?: number;
  user_exam_attempt_id: number;
  part_id: number;
  order_index: number;
  score: number;
  created_at?: Date; // Optional due to defaultValue
}

@Table({ tableName: "user_attempt_parts", timestamps: false })
export class UserAttemptPart extends Model<
  UserAttemptPart,
  UserAttemptPartCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => UserExamAttempt)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_exam_attempt_id!: number;

  @ForeignKey(() => Part)
  @Column({ type: DataType.INTEGER, allowNull: false })
  part_id!: number;

  @Column(DataType.INTEGER)
  order_index!: number;

  @Column(DataType.INTEGER)
  score!: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at!: Date;

  @BelongsTo(() => require("./UserExamAttempt").UserExamAttempt)
  userExamAttempt!: UserExamAttemptType;

  @BelongsTo(() => require("./Part").Part)
  part!: PartType;
}

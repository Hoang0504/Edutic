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

@Table({ tableName: "user_attempt_parts", timestamps: false })
export class UserAttemptPart extends Model<UserAttemptPart> {
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

  @BelongsTo(() => UserExamAttempt)
  userExamAttempt!: UserExamAttempt;

  @BelongsTo(() => Part)
  part!: Part;
}

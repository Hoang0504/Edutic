import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { UserExamAttempt } from "./UserExamAttempt";
import { ExamPart } from "./ExamPart";

@Table({ tableName: "exams", timestamps: false })
export class Exam extends Model<Exam> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.INTEGER)
  year_of_release!: number;

  @Column({
    type: DataType.ENUM("random", "full_test"),
    allowNull: false,
    defaultValue: "full_test",
  })
  type!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.INTEGER)
  estimated_time!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_published!: boolean;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @HasMany(() => UserExamAttempt)
  userExamAttempts!: UserExamAttempt[];

  @HasMany(() => ExamPart)
  examParts!: ExamPart[];
}

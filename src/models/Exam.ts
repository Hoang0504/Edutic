import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import type { UserExamAttempt as UserExamAttemptType } from "./UserExamAttempt";
import type { ExamPart as ExamPartType } from "./ExamPart";

interface ExamCreationAttributes {
  id?: number; // Optional (auto-increment)
  title: string; // Bắt buộc (allowNull: false)
  year_of_release: number; // Bắt buộc (DataType.INTEGER mặc định not null)
  type?: "random" | "full_test"; // Optional (có defaultValue)
  description: string; // Bắt buộc (DataType.TEXT mặc định not null)
  estimated_time: number; // Bắt buộc
  is_published?: boolean; // Optional (có defaultValue)
  created_at?: Date; // Optional (có thể tự động tạo)
  updated_at?: Date; // Optional (có thể tự động tạo)
}

@Table({ tableName: "exams", timestamps: false })
export class Exam extends Model<Exam, ExamCreationAttributes> {
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

  @HasMany(() => require("./UserExamAttempt").UserExamAttempt)
  userExamAttempts!: UserExamAttemptType[];

  @HasMany(() => require("./ExamPart").ExamPart)
  examParts!: ExamPartType[];
}

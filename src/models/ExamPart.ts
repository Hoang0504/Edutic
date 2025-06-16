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
import { Exam } from "./Exam";
import type { Exam as ExamType } from "./Exam";
import { Part } from "./Part";
import type { Part as PartType } from "./Part";

interface ExamPartCreationAttributes {
  id?: number; // Optional (auto-increment)
  exam_id: number; // Bắt buộc (allowNull: false)
  part_id: number; // Bắt buộc (allowNull: false)
  order_index: number; // Bắt buộc (DataType.INTEGER mặc định not null)
}

@Table({ tableName: "exam_parts", timestamps: false })
export class ExamPart extends Model<ExamPart, ExamPartCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Exam)
  @Column({ type: DataType.INTEGER, allowNull: false })
  exam_id!: number;

  @ForeignKey(() => Part)
  @Column({ type: DataType.INTEGER, allowNull: false })
  part_id!: number;

  @Column(DataType.INTEGER)
  order_index!: number;

  @BelongsTo(() => require("./Exam").Exam)
  exam!: ExamType;

  @BelongsTo(() => require("./Part").Part)
  part!: PartType;
}

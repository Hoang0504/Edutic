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
import { Part } from "./Part";

@Table({ tableName: "exam_parts", timestamps: false })
export class ExamPart extends Model<ExamPart> {
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

  @BelongsTo(() => Exam)
  exam!: Exam;

  @BelongsTo(() => Part)
  part!: Part;
} 
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

@Table({ tableName: "parts", timestamps: false })
export class Part extends Model<Part> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Exam)
  @Column({ type: DataType.INTEGER, allowNull: false })
  exam_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  part_number!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.TEXT)
  instruction!: string;

  @Column(DataType.INTEGER)
  time_limit!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => Exam)
  exam!: Exam;
}

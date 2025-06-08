import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { Part } from "./Part";

@Table({ tableName: "exams", timestamps: false })
export class Exam extends Model<Exam> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({
    type: DataType.ENUM("easy", "medium", "hard"),
    defaultValue: "medium",
  })
  difficulty_level!: string;

  @Column(DataType.INTEGER)
  estimated_time!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_published!: boolean;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @HasMany(() => Part)
  parts!: Part[];
}

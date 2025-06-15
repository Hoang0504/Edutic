// models/Translation.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ tableName: "translations", timestamps: false })
export class Translation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.ENUM("question", "answer", "instruction", "transcript"))
  content_type!: "question" | "answer" | "instruction" | "transcript";

  @Column(DataType.INTEGER)
  content_id!: number;

  // @Column(DataType.TEXT)
  // english_text!: string;

  @Column(DataType.TEXT)
  vietnamese_text!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;
}

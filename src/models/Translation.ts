// models/Translation.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

interface TranslationCreationAttributes {
  id?: number;
  content_type: "question" | "answer" | "transcript" | "question_group";
  content_id: number;
  vietnamese_text: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "translations", timestamps: false })
export class Translation extends Model<
  Translation,
  TranslationCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.ENUM("question", "answer", "transcript", "question_group"))
  content_type!: "question" | "answer" | "transcript" | "question_group";

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

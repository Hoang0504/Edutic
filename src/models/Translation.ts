// models/Translation.ts
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
import { AudioFile } from "./AudioFile";

interface TranslationCreationAttributes {
  id?: number;
  content_type: "question" | "answer" | "instruction" | "transcript";
  content_id: number;
  vietnamese_text: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "translations", timestamps: false })
export class Translation extends Model<Translation, TranslationCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.ENUM("question", "answer", "instruction", "transcript"))
  content_type!: "question" | "answer" | "instruction" | "transcript";

  @ForeignKey(() => AudioFile)
  @Column(DataType.INTEGER)
  content_id!: number;

  @Column(DataType.TEXT)
  vietnamese_text!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => AudioFile, { foreignKey: 'content_id', constraints: false })
  audioFile!: AudioFile;
}
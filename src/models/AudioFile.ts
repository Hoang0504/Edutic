// models/AudioFile.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";
import { Part } from "./Part";

@Table({ tableName: "audio_files", timestamps: false })
export class AudioFile extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => Part)
  @Column
  part_id!: number;

  @Column(DataType.STRING)
  file_path!: string;

  @Column(DataType.INTEGER)
  duration!: number;

  @Column(DataType.TEXT)
  transcript!: string;

  @Column(DataType.DATE)
  created_at!: Date;
}

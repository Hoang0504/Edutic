// models/AudioFile.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Part } from "./Part";
import type { Part as PartType } from "./Part";
import type { ListeningTranscript as ListeningTranscriptType } from "./ListeningTranscript";

interface AudioFileCreationAttributes {
  id?: number; // Optional vì là auto-increment
  part_id: number; // Bắt buộc (không có allowNull: false nhưng là foreign key)
  file_path: string; // Bắt buộc (DataType.STRING mặc định not null)
  duration: number; // Bắt buộc
  transcript: string; // Bắt buộc (DataType.TEXT mặc định not null)
  created_at?: Date; // Optional vì có thể tự động tạo
}

@Table({ tableName: "audio_files", timestamps: false })
export class AudioFile extends Model<AudioFile, AudioFileCreationAttributes> {
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

  @HasMany(() => require("./ListeningTranscript").ListeningTranscript)
  listeningTranscripts!: ListeningTranscriptType[];

  @BelongsTo(() => require("./Part").Part)
  part!: PartType;
}

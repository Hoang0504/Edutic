import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from "sequelize-typescript";
import { AudioFile } from "./AudioFile";
import type { AudioFile as AudioFileType } from "./AudioFile";

export interface ListeningTranscriptCreationAttributes {
  id?: number; // nếu dùng auto-increment
  audio_file_id: number;
  level?: "easy" | "medium" | "hard";
  blanks: object; // hoặc có thể cụ thể hơn: `blanks: Record<string, any>`
  created_at?: Date; // optional nếu dùng @CreatedAt tự động
}

@Table({
  tableName: "listening_transcripts",
  timestamps: false,
})
export class ListeningTranscript extends Model<
  ListeningTranscript,
  ListeningTranscriptCreationAttributes
> {
  @ForeignKey(() => AudioFile)
  @Column({ type: DataType.INTEGER, allowNull: false })
  audio_file_id!: number;

  @BelongsTo(() => require("./AudioFile").AudioFile)
  audioFile!: AudioFileType;

  @Column({
    type: DataType.ENUM("easy", "medium", "hard"),
    allowNull: true,
  })
  level!: "easy" | "medium" | "hard";

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  blanks!: object;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;
}

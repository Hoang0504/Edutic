import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import type { Question as QuestionType } from "./Question";
import type { AudioFile as AudioFileType } from "./AudioFile";
import type { ExamPart as ExamPartType } from "./ExamPart";
import type { UserAttemptPart as UserAttemptPartType } from "./UserAttemptPart";

interface PartCreationAttributes {
  id?: number;
  part_number: number;
  title: string;
  description?: string | null; // Chỉ mỗi trường này có thể null
  instruction: string;
  difficulty_level?: "easy" | "medium" | "hard";
  time_limit: number;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "parts", timestamps: false })
export class Part extends Model<Part, PartCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  part_number!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.TEXT)
  instruction!: string;

  @Column({
    type: DataType.ENUM("easy", "medium", "hard"),
    allowNull: false,
    defaultValue: "medium",
  })
  difficulty_level!: string;

  @Column(DataType.INTEGER)
  time_limit!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @HasMany(() => require("./Question").Question)
  questions!: QuestionType[];

  @HasOne(() => require("./AudioFile").AudioFile)
  audioFile!: AudioFileType;

  @HasMany(() => require("./ExamPart").ExamPart)
  examParts!: ExamPartType[];

  @HasMany(() => require("./UserAttemptPart").UserAttemptPart)
  userAttemptParts!: UserAttemptPartType[];
}

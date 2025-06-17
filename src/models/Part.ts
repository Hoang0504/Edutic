import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import { Question } from "./Question";
import { AudioFile } from "./AudioFile";
import { ExamPart } from "./ExamPart";
import { UserAttemptPart } from "./UserAttemptPart";

@Table({ tableName: "parts", timestamps: false })
export class Part extends Model<Part> {
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

  @HasMany(() => Question)
  questions!: Question[];

  @HasMany(() => AudioFile)
  audioFiles!: AudioFile[];

  @HasMany(() => ExamPart)
  examParts!: ExamPart[];

  @HasMany(() => UserAttemptPart)
  userAttemptParts!: UserAttemptPart[];
}

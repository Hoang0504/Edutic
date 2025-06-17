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
import { Skill } from "./Skill";
import type { Skill as SkillType } from "./Skill";
import type { SpeakingWritingSubmission as SpeakingWritingSubmissionType } from "./SpeakingWritingSubmission";

interface SpeakingWritingPromptCreationAttributes {
  id?: number;
  topic: string;
  skill_id: number;
  question: string;
  difficulty_level?: "easy" | "medium" | "hard";
  created_at?: Date;
}

@Table({ tableName: "speaking_writing_prompts", timestamps: false })
export class SpeakingWritingPrompt extends Model<
  SpeakingWritingPrompt,
  SpeakingWritingPromptCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  topic!: string;

  @ForeignKey(() => Skill)
  @Column({ type: DataType.INTEGER, allowNull: false })
  skill_id!: number;

  @Column(DataType.TEXT)
  question!: string;

  @Column({
    type: DataType.ENUM("easy", "medium", "hard"),
    defaultValue: "medium",
  })
  difficulty_level!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./Skill").Skill)
  skill!: SkillType;

  @HasMany(
    () => require("./SpeakingWritingSubmission").SpeakingWritingSubmission
  )
  speaking_writing_submissions!: SpeakingWritingSubmissionType[];
}

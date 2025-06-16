import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import type { UserTargetSkill as UserTargetSkillType } from "./UserTargetSkill";
import type { SpeakingWritingPrompt as SpeakingWritingPromptType } from "./SpeakingWritingPrompt";

interface SkillCreationAttributes {
  id?: number;
  name: string;
  description?: string | null; // Only this field can be null
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "skills", timestamps: false })
export class Skill extends Model<Skill, SkillCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @HasMany(() => require("./UserTargetSkill").UserTargetSkill)
  user_target_skills!: UserTargetSkillType[];

  @HasMany(() => require("./SpeakingWritingPrompt").SpeakingWritingPrompt)
  speaking_writing_prompts!: SpeakingWritingPromptType[];
}

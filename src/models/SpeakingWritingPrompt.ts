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
import { Skill } from "./Skill";

@Table({ tableName: "speaking_writing_prompts", timestamps: false })
export class SpeakingWritingPrompt extends Model<SpeakingWritingPrompt> {
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
  description!: string;

  @Column({
    type: DataType.ENUM("easy", "medium", "hard"),
    defaultValue: "medium",
  })
  difficulty_level!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => Skill)
  skill!: Skill;
}

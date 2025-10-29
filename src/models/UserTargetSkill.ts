import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Skill } from "./Skill";
import type { User as UserType } from "./User";
import type { Skill as SkillType } from "./Skill";

interface UserTargetSkillCreationAttributes {
  user_id: number;
  skill_id: number;
  target_score: number;
}

@Table({ tableName: "user_target_skills", timestamps: false })
export class UserTargetSkill extends Model<
  UserTargetSkill,
  UserTargetSkillCreationAttributes
> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column(DataType.INTEGER)
  user_id!: number;

  @ForeignKey(() => Skill)
  @PrimaryKey
  @Column(DataType.INTEGER)
  skill_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  target_score!: number;

  @BelongsTo(() => User)
  user!: UserType;

  @BelongsTo(() => Skill)
  skill!: SkillType;
}

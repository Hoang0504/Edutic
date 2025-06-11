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

@Table({ tableName: "user_target_skills", timestamps: false })
export class UserTargetSkill extends Model<UserTargetSkill> {
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
  user!: User;

  @BelongsTo(() => Skill)
  skill!: Skill;
}

// models/UserStudyPreference.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  UpdatedAt,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Skill } from "./Skill";

@Table({
  tableName: "user_study_preferences",
  timestamps: false,
})
export class UserStudyPreference extends Model<UserStudyPreference> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => Skill)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  skill_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  daily_minutes!: number;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_at",
    defaultValue: DataType.NOW,
  })
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Skill)
  skill!: Skill;
}

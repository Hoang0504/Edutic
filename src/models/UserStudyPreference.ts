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
import type { User as UserType } from "./User";
import type { Skill as SkillType } from "./Skill";

interface UserStudyPreferenceCreationAttributes {
  user_id: number;
  skill_id: number;
  daily_minutes: number;
  updated_at?: Date;
}

@Table({
  tableName: "user_study_preferences",
  timestamps: false,
})
export class UserStudyPreference extends Model<
  UserStudyPreference,
  UserStudyPreferenceCreationAttributes
> {
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

  @BelongsTo(() => require("./User").User)
  user!: UserType;

  @BelongsTo(() => require("./Skill").Skill)
  skill!: SkillType;
}

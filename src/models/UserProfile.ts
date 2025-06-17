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
import type { User as UserType } from "./User";

interface UserProfileCreationAttributes {
  user_id: number;
  study_time_preference?: number | null; // Can be null
  level?: "beginner" | "intermediate" | "advanced";
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "user_profiles", timestamps: false })
export class UserProfile extends Model<
  UserProfile,
  UserProfileCreationAttributes
> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column(DataType.INTEGER)
  study_time_preference!: number;

  @Column({
    type: DataType.ENUM("beginner", "intermediate", "advanced"),
    defaultValue: "beginner",
  })
  level!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => require("./User").User)
  user!: UserType;
}

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  // BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "user_profiles", timestamps: false })
export class UserProfile extends Model<UserProfile> {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column(DataType.INTEGER)
  target_score!: number;

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

  // @BelongsTo(() => User)
  // user!: User;
}

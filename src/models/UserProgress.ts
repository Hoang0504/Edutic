import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  Unique,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "user_progress", timestamps: false })
export class UserProgress extends Model<UserProgress> {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => User)
  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  user_id!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  listening_score!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  reading_score!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  speaking_score!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  writing_score!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  total_study_time!: number;

  @Column(DataType.DATE)
  last_activity_date!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}

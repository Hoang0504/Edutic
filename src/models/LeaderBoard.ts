// models/LeaderBoard.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "leaderboard", timestamps: false })
export class LeaderBoard extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @Column(DataType.INTEGER)
  score!: number;

  @Column(DataType.ENUM("weekly", "monthly", "all_time"))
  period_type!: "weekly" | "monthly" | "all_time";

  @Column(DataType.DATE)
  period_start_date!: Date;

  @Column(DataType.INTEGER)
  rank!: number;

  @Column(DataType.DATE)
  updated_at!: Date;
}

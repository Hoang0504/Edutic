// models/LeaderBoard.ts
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
import { User } from "./User";
import type { User as UserType } from "./User";

interface LeaderBoardCreationAttributes {
  id?: number;
  user_id: number;
  score: number;
  period_type: "weekly" | "monthly" | "all_time";
  period_start_date: Date;
  rank: number;
  updated_at?: Date;
}

@Table({ tableName: "leaderboard", timestamps: false })
export class LeaderBoard extends Model<
  LeaderBoard,
  LeaderBoardCreationAttributes
> {
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

  @BelongsTo(() => require("./User").User)
  user!: UserType;
}

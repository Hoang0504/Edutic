import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import type { User as UserType } from "./User";

interface ApiUsageCreationAttributes {
  id?: number;
  user_id: number;
  request_count: number;
  date: string; // ISO format date, e.g. '2025-06-22'
  created_at?: Date; // optional since auto-managed
  updated_at?: Date; // optional since auto-managed
}

@Table({ tableName: "api_usage", timestamps: false })
export class ApiUsage extends Model<ApiUsage, ApiUsageCreationAttributes> {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  user_id!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  request_count!: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => require("./User").User)
  user!: UserType;
}

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

@Table({ tableName: "api_usage", timestamps: false })
export class ApiUsage extends Model<ApiUsage> {
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

  @BelongsTo(() => User)
  user!: User;
}

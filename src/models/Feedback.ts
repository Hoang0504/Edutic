import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  // BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "feedbacks", timestamps: false })
export class Feedback extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  // @BelongsTo(() => User)
  // user?: User;

  @Column(DataType.STRING)
  content!: string;

  @Column(DataType.INTEGER)
  rating!: number;

  @Column(DataType.DATE)
  created_at!: Date;
}

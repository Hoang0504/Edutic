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

interface FeedbackCreationAttributes {
  id?: number;
  user_id: number;
  content: string;
  rating: number;
  created_at?: Date;
}

@Table({ tableName: "feedbacks", timestamps: false })
export class Feedback extends Model<Feedback, FeedbackCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @Column(DataType.STRING)
  content!: string;

  @Column(DataType.INTEGER)
  rating!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./User").User)
  user?: UserType;
}

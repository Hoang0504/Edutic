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

@Table({ tableName: "ai_generated_contents", timestamps: false })
export class AIGeneratedContent extends Model {
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
  input!: string;

  @Column(DataType.TEXT)
  output!: string;

  @Column(DataType.ENUM("flashcard", "correction", "explanation"))
  type!: "flashcard" | "correction" | "explanation";

  @Column(DataType.ENUM("pending", "success", "failed"))
  status!: "pending" | "success" | "failed";

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;
}

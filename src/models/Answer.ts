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
import { Question } from "./Question";

@Table({ tableName: "answers", timestamps: false })
export class Answer extends Model<Answer> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  question_id!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_correct!: boolean;

  @Column(DataType.TEXT)
  explanation!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  // @BelongsTo(() => Question)
  // question!: Question;
}

// models/QuestionGroup.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  HasMany,
} from "sequelize-typescript";
import { Part } from "./Part"; // Giả sử bạn có model Part đã định nghĩa
import { Question } from "./Question";

@Table({
  tableName: "question_groups",
  timestamps: false,
})
export class QuestionGroup extends Model<QuestionGroup> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Part)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  part_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  image_url?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "created_at",
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @BelongsTo(() => Part)
  part!: Part;

  @HasMany(() => Question)
  questions!: Question[];
}

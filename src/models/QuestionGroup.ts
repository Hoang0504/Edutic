// models/QuestionGroup.ts

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  HasMany,
} from "sequelize-typescript";
import type { Question as QuestionType } from "./Question";

interface QuestionGroupCreationAttributes {
  id?: number;
  image_url?: string | null;
  content?: string | null;
  created_at?: Date;
}

@Table({
  tableName: "question_groups",
  timestamps: false,
})
export class QuestionGroup extends Model<
  QuestionGroup,
  QuestionGroupCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

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

  @HasMany(() => require("./Question").Question)
  questions!: QuestionType[];
}

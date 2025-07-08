import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Part } from "./Part";
import { QuestionGroup } from "./QuestionGroup";
import type { Part as PartType } from "./Part";
import type { Answer as AnswerType } from "./Answer";
import type { QuestionGroup as QuestionGroupType } from "./QuestionGroup";
import type { UserAnswer as UserAnswerType } from "./UserAnswer";

interface QuestionCreationAttributes {
  id?: number;
  part_id: number;
  group_id: number | null;
  question_number: number;
  content: string;
  question_type:
    | "multiple_choice"
    | "fill_in_blank"
    | "matching"
    | "speaking"
    | "writing";
  image_url: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "questions", timestamps: false })
export class Question extends Model<Question, QuestionCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Part)
  @Column({ type: DataType.INTEGER, allowNull: false })
  part_id!: number;

  @ForeignKey(() => QuestionGroup)
  @Column({ type: DataType.INTEGER, allowNull: true })
  group_id!: number | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  question_number!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({
    type: DataType.ENUM(
      "multiple_choice",
      "fill_in_blank",
      "matching",
      "speaking",
      "writing"
    ),
    allowNull: false,
  })
  question_type!: string;

  @Column(DataType.STRING)
  image_url!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => require("./Part").Part)
  part!: PartType;

  @BelongsTo(() => require("./QuestionGroup").QuestionGroup)
  group!: QuestionGroupType;

  @HasMany(() => require("./Answer").Answer)
  answers!: AnswerType[];

  @HasMany(() => require("./UserAnswer").UserAnswer)
  user_answers!: UserAnswerType[];
}

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
import { Answer } from "./Answer";

@Table({ tableName: "questions", timestamps: false })
export class Question extends Model<Question> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Part)
  @Column({ type: DataType.INTEGER, allowNull: false })
  part_id!: number;

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

  @BelongsTo(() => Part)
  part!: Part;

  @HasMany(() => Answer)
  answers!: Answer[];
}

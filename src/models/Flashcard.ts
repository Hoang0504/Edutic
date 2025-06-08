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
import { Vocabulary } from "./Vocabulary";

interface FlashcardCreationAttributes {
  user_id: number;
  vocabulary_id: number;
  mastery_level?: number;
  review_count?: number;
  next_review_date?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "flashcards", timestamps: false })
export class Flashcard extends Model<Flashcard, FlashcardCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @ForeignKey(() => Vocabulary)
  @Column({ type: DataType.INTEGER, allowNull: false })
  vocabulary_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  mastery_level!: number;

  @Column(DataType.DATE)
  next_review_date!: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  review_count!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  // @BelongsTo(() => User)
  // user!: User;

  // @BelongsTo(() => Vocabulary)
  // vocabulary!: Vocabulary;
}

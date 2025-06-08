// models/Vocabulary.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  // HasMany,
} from "sequelize-typescript";
// import { Flashcard } from "./Flashcard";

interface VocabularyCreationAttributes {
  word: string;
  image_url?: string | null;
  pronunciation?: string | null;
  speech_audio_url?: string | null;
  meaning?: string | null;
  example: string;
  context?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "vocabularies", timestamps: false })
export class Vocabulary extends Model<
  Vocabulary,
  VocabularyCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.STRING)
  word!: string;

  @Column(DataType.STRING)
  image_url!: string;

  @Column(DataType.STRING)
  pronunciation!: string;

  @Column(DataType.STRING)
  speech_audio_url!: string;

  @Column(DataType.STRING)
  meaning!: string;

  @Column(DataType.STRING)
  example!: string;

  @Column(DataType.STRING)
  context!: string;

  @Column(DataType.ENUM("pending", "approved", "rejected"))
  status!: "pending" | "approved" | "rejected";

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  // @HasMany(() => Flashcard)
  // flashcards?: Flashcard[];
}

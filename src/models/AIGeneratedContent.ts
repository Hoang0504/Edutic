import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  // BelongsTo,
} from "sequelize-typescript";

interface AIGeneratedContentCreationAttributes {
  id?: number; // Optional vì là auto-increment
  slug: string;
  type: "flashcard" | "correction" | "explanation";
  content_id: number;
  generated_text?: string;
  prompt_used: string;
  created_at?: Date; // Optional vì có thể tự động tạo
}

@Table({ tableName: "ai_generated_contents", timestamps: false })
export class AIGeneratedContent extends Model<
  AIGeneratedContent,
  AIGeneratedContentCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column(DataType.STRING)
  slug!: string;

  @Column(DataType.ENUM("flashcard", "correction", "explanation"))
  type!: "flashcard" | "correction" | "explanation";

  @Column(DataType.NUMBER)
  content_id!: number;

  @Column(DataType.TEXT)
  generated_text!: string;

  @Column(DataType.TEXT)
  prompt_used!: string;

  @Column(DataType.DATE)
  created_at!: Date;
}

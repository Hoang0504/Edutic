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

interface StudySessionCreationAttributes {
  id?: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
  duration: number;
  activity_type:
    | "exam"
    | "flashcard"
    | "listening"
    | "reading"
    | "speaking"
    | "writing";
  created_at?: Date;
}

@Table({ tableName: "study_sessions", timestamps: false })
export class StudySession extends Model<
  StudySession,
  StudySessionCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  start_time!: Date;

  @Column(DataType.DATE)
  end_time!: Date;

  @Column(DataType.INTEGER)
  duration!: number;

  @Column({
    type: DataType.ENUM(
      "exam",
      "flashcard",
      "listening",
      "reading",
      "speaking",
      "writing"
    ),
    allowNull: false,
  })
  activity_type!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => require("./User").User)
  user!: UserType;
}

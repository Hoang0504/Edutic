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

@Table({ tableName: "study_sessions", timestamps: false })
export class StudySession extends Model<StudySession> {
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

  @Column(DataType.INTEGER)
  activity_id!: number;

  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}

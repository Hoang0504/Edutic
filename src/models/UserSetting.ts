import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Unique,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { StudyMusic } from "./StudyMusic";

@Table({ tableName: "user_settings", timestamps: false })
export class UserSetting extends Model<UserSetting> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Unique
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 25 })
  pomodoro_work_time!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  pomodoro_break_time!: number;

  @Column({
    type: DataType.ENUM("light", "dark", "system"),
    defaultValue: "system",
  })
  ui_theme!: string;

  @ForeignKey(() => StudyMusic)
  @Column(DataType.INTEGER)
  study_music_id!: number;

  @Column(DataType.JSON)
  notification_settings!: object;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => StudyMusic)
  study_music!: StudyMusic;
}

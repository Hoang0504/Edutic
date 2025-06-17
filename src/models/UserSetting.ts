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
import type { User as UserType } from "./User";
import type { StudyMusic as StudyMusicType } from "./StudyMusic";

interface UserSettingCreationAttributes {
  id?: number;
  user_id: number;
  pomodoro_work_time?: number;
  pomodoro_break_time?: number;
  ui_theme?: "light" | "dark" | "system";
  study_music_id?: number | null; // Can be null
  notification_settings?: object | null; // Can be null
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "user_settings", timestamps: false })
export class UserSetting extends Model<
  UserSetting,
  UserSettingCreationAttributes
> {
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

  @BelongsTo(() => require("./User").User)
  user!: UserType;

  @BelongsTo(() => require("./StudyMusic").StudyMusic)
  study_music!: StudyMusicType;
}

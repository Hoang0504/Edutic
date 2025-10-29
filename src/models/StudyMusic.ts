import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  HasOne,
} from "sequelize-typescript";
import type { UserSetting as UserSettingType } from "./UserSetting";

interface StudyMusicCreationAttributes {
  id?: number;
  title: string;
  duration: number;
  file_url: string;
  created_at?: Date;
  updated_at?: Date;
}

@Table({ tableName: "study_music", timestamps: false })
export class StudyMusic extends Model<
  StudyMusic,
  StudyMusicCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column(DataType.INTEGER)
  duration!: number;

  @Column(DataType.STRING)
  file_url!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @HasOne(() => require("./UserSetting").UserSetting)
  user_setting!: UserSettingType;
}

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

@Table({ tableName: "study_music", timestamps: false })
export class StudyMusic extends Model<StudyMusic> {
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
}

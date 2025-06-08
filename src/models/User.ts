import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  // HasOne,
} from "sequelize-typescript";
// import { UserProfile } from "./UserProfile";

@Table({ tableName: "users", timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password_hash!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  avatar!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_email_verified!: boolean;

  @Column({ type: DataType.ENUM("email", "google"), defaultValue: "email" })
  auth_provider!: string;

  @Column(DataType.STRING)
  auth_provider_id!: string;

  @Column(DataType.STRING)
  verification_token!: string;

  @Column(DataType.DATE)
  verification_token_expires!: string;

  @Column(DataType.DATE)
  created_at!: Date;

  @Column(DataType.DATE)
  updated_at!: Date;

  @Column(DataType.DATE)
  last_login!: Date;

  // @HasOne(() => UserProfile)
  // profile!: UserProfile;
}

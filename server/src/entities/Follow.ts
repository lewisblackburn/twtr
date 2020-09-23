import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Follow extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  value: boolean;

  @Field()
  @Column({ nullable: true })
  userId: number;

  @Field()
  @Column({ nullable: true })
  theirId: number;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: "CASCADE",
  })
  user: User;
}

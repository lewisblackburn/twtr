import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Heart extends BaseEntity {
  @Field()
  @Column()
  value: boolean;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @Column({ nullable: true })
  displayname: string;

  @Field()
  @Column({ nullable: true })
  username: string;

  @Field()
  @Column({ nullable: true })
  bio: string;

  @Field()
  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User, (user) => user.hearts)
  user: User;

  @ManyToOne(() => Post, (post) => post.hearts, {
    onDelete: "CASCADE",
  })
  post: Post;
}

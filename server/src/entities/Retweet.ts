import { Field } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Retweet extends BaseEntity {
  @Column()
  value: boolean;

  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @ManyToOne(() => User, (user) => user.retweets)
  user: User;

  @ManyToOne(() => Post, (post) => post.retweets, {
    onDelete: "CASCADE",
  })
  post: Post;
}

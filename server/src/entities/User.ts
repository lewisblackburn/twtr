import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Heart } from "./Heart";
import { Retweet } from "./Retweet";
import { Follow } from "./Follow";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  avatar?: string;

  @Field()
  @Column()
  banner?: string;

  @Field()
  @Column()
  displayname!: string;

  @Field()
  @Column()
  bio?: string;

  @Field()
  @Column()
  website?: string;

  @Field()
  @Column()
  birthday: string;

  @Field({ defaultValue: false })
  followStatus: boolean;

  @OneToMany(() => Post, (post) => post.creator, {
    onDelete: "CASCADE",
  })
  posts: Post[];

  @OneToMany(() => Heart, (heart) => heart.user, {
    onDelete: "CASCADE",
  })
  hearts: Heart[];

  @OneToMany(() => Retweet, (retweet) => retweet.user, {
    onDelete: "CASCADE",
  })
  retweets: Retweet[];

  @OneToMany(() => Follow, (follow) => follow.user, {
    onDelete: "CASCADE",
  })
  followers: Follow[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

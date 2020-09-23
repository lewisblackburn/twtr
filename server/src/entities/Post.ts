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
import { Heart } from "./Heart";
import { Retweet } from "./Retweet";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  heartCount: number;

  @Field({ defaultValue: false })
  heartStatus: boolean;

  @Field()
  @Column({ default: 0 })
  retweetId!: number;

  @Field()
  @Column({ default: false })
  retweet!: boolean;

  @Field()
  @Column({ type: "int", default: 0 })
  retweetCount: number;

  @Field({ defaultValue: false })
  retweetStatus: boolean;

  @Field()
  @Column({ default: 0 })
  retweeterId: number;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @OneToMany(() => Heart, (heart) => heart.post)
  hearts: Heart[];

  @OneToMany(() => Retweet, (retweet) => retweet.post)
  retweets: Retweet[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

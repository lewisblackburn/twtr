import { Follow } from "../entities/Follow";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Heart } from "../entities/Heart";
import { Post } from "../entities/Post";
import { Retweet } from "../entities/Retweet";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { Users } from "./Users";

@InputType()
class PostInput {
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResovler {
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => User, { nullable: true })
  retweeter(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    if (post.retweet) {
      return userLoader.load(post.retweeterId);
    }
    return null;
  }

  @FieldResolver()
  async heartStatus(
    @Root() post: Post,
    @Ctx() { heartLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }

    const heart = await heartLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return heart ? heart.value : false;
  }

  @FieldResolver()
  async retweetStatus(
    @Root() post: Post,
    @Ctx() { retweetLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }

    const retweet = await retweetLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return retweet ? retweet.value : false;
  }

  @Query(() => Users, { nullable: true })
  async hearts(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }
    const ids: number[] = [];
    const hearts = await Heart.find({
      where: { postId, value: true },
    });
    hearts.forEach((heart) => {
      ids.push(heart.userId);
    });
    return {
      users: User.findByIds(ids),
    };
  }

  @Query(() => Users, { nullable: true })
  async retweets(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }
    const ids: number[] = [];
    const retweets = await Retweet.find({
      where: { postId, value: true },
    });
    retweets.forEach((retweet) => {
      ids.push(retweet.userId);
    });
    return {
      users: User.findByIds(ids),
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async heart(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const heart = await Heart.findOne({ where: { postId, userId } });

    if (heart === undefined) {
      // like when never liked (to create table)
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            insert into heart ("userId", "postId", value)
            values($1, $2, $3)
            `,
          [userId, postId, true]
        );
        await tm.query(
          `
            update post
            set "heartCount" = "heartCount" + 1 
            where id = $1
          `,
          [postId]
        );
      });
    } else if (heart?.value) {
      // unlike when liked
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update heart
          set value = $1
          where "postId" = $2 and "userId" = $3
          `,
          [!heart?.value, postId, userId]
        );
        await tm.query(
          `
            update post
            set "heartCount" = "heartCount" - 1 
            where id = $1
          `,
          [postId]
        );
      });
    } else if (!heart?.value) {
      // like when unliked
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update heart
          set value = $1
          where "postId" = $2 and "userId" = $3
          `,
          [!heart?.value, postId, userId]
        );
        await tm.query(
          `
          update post
          set "heartCount" = "heartCount" + 1
          where id = $1
        `,
          [postId]
        );
      });
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async retweet(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const retweet = await Retweet.findOne({ where: { postId, userId } });
    const post = await Post.findOne({
      where: { id: postId },
    });
    // stops you from retweeting your own tweet twice
    if (post?.retweeterId !== userId) {
      if (retweet === undefined) {
        // like when never liked (to create table)
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            insert into retweet ("userId", "postId", value)
            values($1, $2, $3)
            `,
            [userId, postId, true]
          );
          await tm.query(
            `
            update post
            set "retweetCount" = "retweetCount" + 1 
            where id = $1
          `,
            [postId]
          );
        });
        await Post.create({
          text: post?.text,
          retweetId: post?.id,
          retweet: true,
          retweeterId: userId,
          creatorId: post?.creatorId,
        }).save();
      } else if (retweet?.value) {
        // unlike when liked
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            update retweet
            set value = $1
            where "postId" = $2 and "userId" = $3
            `,
            [!retweet?.value, postId, userId]
          );
          await tm.query(
            `
            update post
            set "retweetCount" = "retweetCount" - 1 
            where id = $1
          `,
            [postId]
          );
        });
        await Post.delete({
          text: post?.text,
          retweetId: post?.id,
          retweet: true,
          retweeterId: userId,
          creatorId: post?.creatorId,
        });
      } else if (!retweet?.value) {
        // like when unliked
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            update retweet
            set value = $1
            where "postId" = $2 and "userId" = $3
            `,
            [!retweet?.value, postId, userId]
          );
          await tm.query(
            `
            update post
            set "retweetCount" = "retweetCount" + 1 
            where id = $1
          `,
            [postId]
          );
        });

        await Post.create({
          text: post?.text,
          retweetId: post?.id,
          retweet: true,
          retweeterId: userId,
          creatorId: post?.creatorId,
        }).save();
      }
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = Math.min(50, limit) + 1;
    const replacements: any[] = [realLimitPlusOne];
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }
    let posts = await getConnection().query(
      `
      select p.*
      from post p
      ${cursor ? `where p."createdAt" < $2` : ""}
      order by p."createdAt" DESC
      limit $1
      `,
      replacements
    );

    const ids: number[] = [req.session.userId];
    const follows = await Follow.find({
      where: { userId: req.session.userId, value: true },
    });
    follows.forEach((follow) => {
      ids.push(follow.theirId);
    });

    posts = (await posts).filter((post: any) => ids.includes(post.creatorId));

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("postId", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    if (input.text.length === 0 || input.text.length > 280) {
      return null;
    }
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}

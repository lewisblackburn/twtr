import argon2 from "argon2";
import { isAuth } from "../middleware/isAuth";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { Follow } from "../entities/Follow";
import { unlink } from "fs";
import session from "express-session";
import { Users } from "./Users";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // current user => show them so u can show them email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // another user wants to see someones elses email
    return "";
  }

  @FieldResolver(() => String)
  website(@Root() user: User, @Ctx() { req }: MyContext) {
    let url = user.website || "";
    if (user.website) {
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
    }
    return url;
  }

  @FieldResolver()
  async followStatus(
    @Root() user: User,
    @Ctx() { followLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }

    const follow = await Follow.findOne({
      where: { userId: req.session.userId, theirId: user.id },
    });

    return follow ? follow.value : false;
  }

  @Query(() => Users, { nullable: true })
  async followers(
    @Arg("theirId", () => Int) theirId: number,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }
    const ids: number[] = [];
    const follows = await Follow.find({
      where: { theirId, value: true },
    });
    follows.forEach((follow) => {
      ids.push(follow.userId);
    });
    return {
      users: User.findByIds(ids),
      amount: Follow.count({ where: { theirId, value: true } }),
    };
  }

  @Query(() => Users, { nullable: true })
  async following(
    @Arg("userId", () => Int) userId: number,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) {
      return false;
    }
    const ids: number[] = [];
    const follows = await Follow.find({
      where: { userId, value: true },
    });
    follows.forEach((follow) => {
      ids.push(follow.theirId);
    });
    return {
      users: User.findByIds(ids),
      amount: Follow.count({ where: { userId, value: true } }),
    };
  }

  @Query(() => Users, { nullable: true })
  async search(@Arg("username") username: string) {
    username = username.toLowerCase();
    if (username === null || username === "") {
      return null;
    }
    let users = User.find({});
    (users as any) = (await users).filter((user) =>
      user.username.toLowerCase().includes(username)
    );
    return {
      users: users,
    };
  }

  @Query(() => User, { nullable: true })
  user(@Arg("username") username: string) {
    return User.findOne({ where: { username: username } });
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async follow(
    @Arg("theirId", () => Int) theirId: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const follow = await Follow.findOne({ where: { userId, theirId } });

    if (userId !== theirId) {
      if (follow === undefined) {
        // like when never liked (to create table)
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
        insert into follow (value, "userId", "theirId")
        values($1, $2, $3)
                      `,
            [true, userId, theirId]
          );
        });
      } else if (follow?.value) {
        // unlike when liked
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            update follow
            set value = false
            where "theirId" = $1
            `,
            [theirId]
          );
        });
      } else if (!follow?.value) {
        // like when unliked
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            update follow
            set value = $1
            where  "theirId" = $2
            `,
            [!follow?.value, theirId]
          );
        });
      }
    }
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = await validateRegister(options);
    if (errors) return { errors };

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
        displayname: options.displayname,
        avatar: options.avatar,
        banner: options.banner,
        bio: options.bio,
        website: options.website,
        birthday: options.birthday,
      }).save();
    } catch (err) {
      // username already exists error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username has already been taken",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cooke on the user
    // keep them logged in
    req.session.userId = user?.id;
    return {
      user,
    };
  }
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}

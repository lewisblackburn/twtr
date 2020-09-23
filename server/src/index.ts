import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Follow } from "./entities/Follow";
import { Heart } from "./entities/Heart";
import { Post } from "./entities/Post";
import { Retweet } from "./entities/Retweet";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResovler } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createFollowLoader } from "./utils/createFollowLoader";
import { createHeartLoader } from "./utils/createHeartLoader";
import { createRetweetLoader } from "./utils/createRetweetLoader";
import { createUserLoader } from "./utils/createUserLoader";

// fix getting posts by followers
// make server more efficient by change field resolvers to queries but not the main ones
// change ones like followers, following, hearts, retweets

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Heart, Retweet, Follow],
  });
  await conn.runMigrations();

  // await Post.delete({});
  // await User.delete({});

  // express
  const app = express();

  // redis
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  // cors
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".zxffo.cc" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  // apollo
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResovler, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      heartLoader: createHeartLoader(),
      retweetLoader: createRetweetLoader(),
      followLoader: createFollowLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(
      `server started on localhost: https://localhost:${process.env.PORT}`
    );
  });
};

main().catch((err) => {
  console.log(err);
});

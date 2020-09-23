import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createHeartLoader } from "./utils/createHeartLoader";
import { createRetweetLoader } from "./utils/createRetweetLoader";
import { createFollowLoader } from "./utils/createFollowLoader";

export type MyContext = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  heartLoader: ReturnType<typeof createHeartLoader>;
  retweetLoader: ReturnType<typeof createRetweetLoader>;
  followLoader: ReturnType<typeof createFollowLoader>;
};

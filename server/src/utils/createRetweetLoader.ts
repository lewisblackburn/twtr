import { Retweet } from "../entities/Retweet";
import DataLoader from "dataloader";

export const createRetweetLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Retweet | null>(
    async (keys) => {
      const retweets = await Retweet.findByIds(keys as any);
      const retweetIdsToRetweet: Record<string, Retweet> = {};
      retweets.forEach((retweet) => {
        retweetIdsToRetweet[`${retweet.userId}|${retweet.postId}`] = retweet;
      });

      return keys.map(
        (key) => retweetIdsToRetweet[`${key.userId}|${key.postId}`]
      );
    }
  );

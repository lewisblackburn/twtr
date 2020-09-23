import { Follow } from "../entities/Follow";
import DataLoader from "dataloader";

export const createFollowLoader = () =>
  new DataLoader<{ userId: number; theirId: number }, Follow | null>(
    async (keys) => {
      const followers = await Follow.findByIds(keys as any);
      const followIdsToFollow: Record<string, Follow> = {};
      followers.forEach((follow) => {
        followIdsToFollow[`${follow.userId}|${follow.theirId}`] = follow;
      });

      return keys.map(
        (key) => followIdsToFollow[`${key.theirId}|${key.userId}`]
      );
    }
  );

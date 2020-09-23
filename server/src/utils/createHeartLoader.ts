import { Heart } from "../entities/Heart";
import DataLoader from "dataloader";

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createHeartLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Heart | null>(
    async (keys) => {
      const hearts = await Heart.findByIds(keys as any);
      const heartIdsToHeart: Record<string, Heart> = {};
      hearts.forEach((heart) => {
        heartIdsToHeart[`${heart.userId}|${heart.postId}`] = heart;
      });

      return keys.map((key) => heartIdsToHeart[`${key.userId}|${key.postId}`]);
    }
  );

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllReviews,
  findReviewById,
  findReviewsByWorker,
  createReview,
  toggleReviewVisibility,
  getAverageRating,
  getTotalReviewsCount,
  getRatingDistribution,
} from "./queries/reviews";

export const reviewRouter = createRouter({
  list: publicQuery.query(() => findAllReviews()),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findReviewById(input.id)),

  byWorker: publicQuery
    .input(z.object({ workerId: z.number() }))
    .query(({ input }) => findReviewsByWorker(input.workerId)),

  create: publicQuery
    .input(
      z.object({
        bookingId: z.number(),
        workerId: z.number().optional(),
        customerName: z.string().min(1),
        customerPhone: z.string().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) => createReview(input)),

  toggleVisibility: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => toggleReviewVisibility(input.id)),

  stats: publicQuery.query(async () => {
    const [average, total, distribution] = await Promise.all([
      getAverageRating(),
      getTotalReviewsCount(),
      getRatingDistribution(),
    ]);
    return { average, total, distribution };
  }),
});

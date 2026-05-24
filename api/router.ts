import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { workerRouter } from "./workerRouter";
import { serviceRouter } from "./serviceRouter";
import { bookingRouter } from "./bookingRouter";
import { reviewRouter } from "./reviewRouter";
import { loyaltyRouter } from "./loyaltyRouter";
import { notificationRouter } from "./notificationRouter";
import { analyticsRouter } from "./analyticsRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  worker: workerRouter,
  service: serviceRouter,
  booking: bookingRouter,
  review: reviewRouter,
  loyalty: loyaltyRouter,
  notification: notificationRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

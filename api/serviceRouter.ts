import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllServices,
  findActiveServices,
  findServiceById,
  createService,
  updateService,
  deleteService,
  getTotalServicesCount,
} from "./queries/services";

export const serviceRouter = createRouter({
  list: publicQuery.query(() => findAllServices()),

  active: publicQuery.query(() => findActiveServices()),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findServiceById(input.id)),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        nameAr: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["exterior", "interior", "full", "premium", "detailing"]),
        basePrice: z.string().min(1),
        duration: z.number().min(1),
        icon: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .mutation(({ input }) => createService(input)),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        nameAr: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["exterior", "interior", "full", "premium", "detailing"]).optional(),
        basePrice: z.string().optional(),
        duration: z.number().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
        isActive: z.enum(["true", "false"]).optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateService(id, data);
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteService(input.id)),

  count: publicQuery.query(() => getTotalServicesCount()),
});

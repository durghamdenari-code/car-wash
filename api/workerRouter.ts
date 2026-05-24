import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import {
  findAllWorkers,
  findWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getActiveWorkersCount,
  getTotalWorkersCount,
  getAverageWorkerRating,
} from "./queries/workers";

export const workerRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        search: z.string().optional(),
        status: z.string().optional(),
      }).optional()
    )
    .query(({ input }) => findAllWorkers(input?.search, input?.status)),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(({ input }) => findWorkerById(input.id)),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email().optional(),
        vehicleType: z.string().optional(),
        vehiclePlate: z.string().optional(),
      })
    )
    .mutation(({ input }) => createWorker(input)),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        phone: z.string().min(1).optional(),
        email: z.string().email().optional().nullable(),
        status: z.enum(["active", "inactive", "busy", "offline"]).optional(),
        currentLat: z.string().optional(),
        currentLng: z.string().optional(),
        vehicleType: z.string().optional(),
        vehiclePlate: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.currentLat !== undefined) updateData.currentLat = data.currentLat;
      if (data.currentLng !== undefined) updateData.currentLng = data.currentLng;
      if (data.vehicleType !== undefined) updateData.vehicleType = data.vehicleType;
      if (data.vehiclePlate !== undefined) updateData.vehiclePlate = data.vehiclePlate;
      return updateWorker(id, updateData);
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteWorker(input.id)),

  stats: publicQuery.query(async () => {
    const [active, total, avgRating] = await Promise.all([
      getActiveWorkersCount(),
      getTotalWorkersCount(),
      getAverageWorkerRating(),
    ]);
    return { active, total, avgRating };
  }),
});

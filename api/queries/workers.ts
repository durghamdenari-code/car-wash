import { getDb } from "./connection";
import { workers } from "@db/schema";
import { eq, desc, like, or, and, sql } from "drizzle-orm";

export async function findAllWorkers(search?: string, status?: string) {
  const db = getDb();
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(workers.name, `%${search}%`),
        like(workers.phone, `%${search}%`),
        like(workers.email, `%${search}%`)
      )
    );
  }

  if (status) {
    conditions.push(eq(workers.status, status as any));
  }

  return db
    .select()
    .from(workers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(workers.createdAt));
}

export async function findWorkerById(id: number) {
  return getDb()
    .select()
    .from(workers)
    .where(eq(workers.id, id))
    .then((rows) => rows[0] || null);
}

export async function createWorker(data: {
  name: string;
  phone: string;
  email?: string;
  vehicleType?: string;
  vehiclePlate?: string;
}) {
  const db = getDb();
  const [result] = await db.insert(workers).values({
    ...data,
    status: "active",
    rating: "5.0",
    totalJobs: 0,
  } as any).$returningId();
  return findWorkerById(result.id);
}

export async function updateWorker(id: number, data: any) {
  await getDb()
    .update(workers)
    .set(data)
    .where(eq(workers.id, id));
  return findWorkerById(id);
}

export async function deleteWorker(id: number) {
  return getDb().delete(workers).where(eq(workers.id, id));
}

export async function getActiveWorkersCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(workers)
    .where(eq(workers.status, "active"));
  return result[0]?.count || 0;
}

export async function getTotalWorkersCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(workers);
  return result[0]?.count || 0;
}

export async function getAverageWorkerRating() {
  const result = await getDb()
    .select({ avg: sql<string>`avg(${workers.rating})` })
    .from(workers);
  return parseFloat(result[0]?.avg || "0");
}

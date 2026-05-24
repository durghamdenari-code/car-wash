import { getDb } from "./connection";
import { services } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function findAllServices() {
  return getDb()
    .select()
    .from(services)
    .orderBy(desc(services.createdAt));
}

export async function findActiveServices() {
  return getDb()
    .select()
    .from(services)
    .where(eq(services.isActive, "true"))
    .orderBy(desc(services.createdAt));
}

export async function findServiceById(id: number) {
  return getDb()
    .select()
    .from(services)
    .where(eq(services.id, id))
    .then((rows) => rows[0] || null);
}

export async function createService(data: {
  name: string;
  nameAr?: string;
  description?: string;
  category: string;
  basePrice: string;
  duration: number;
  icon?: string;
  color?: string;
}) {
  const db = getDb();
  const [result] = await db.insert(services).values({
    ...data,
    isActive: "true",
  } as any).$returningId();
  return findServiceById(result.id);
}

export async function updateService(id: number, data: any) {
  await getDb()
    .update(services)
    .set(data)
    .where(eq(services.id, id));
  return findServiceById(id);
}

export async function deleteService(id: number) {
  return getDb().delete(services).where(eq(services.id, id));
}

export async function getTotalServicesCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(services);
  return result[0]?.count || 0;
}

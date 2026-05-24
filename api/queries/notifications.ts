import { getDb } from "./connection";
import { notifications } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function findAllNotifications(limit: number = 50) {
  return getDb()
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function findUnreadNotifications() {
  return getDb()
    .select()
    .from(notifications)
    .where(eq(notifications.isRead, "false"))
    .orderBy(desc(notifications.createdAt));
}

export async function createNotification(data: {
  title: string;
  message: string;
  type?: string;
  recipientType?: string;
  recipientId?: string;
  relatedId?: number;
}) {
  const db = getDb();
  const insertData: any = {
    title: data.title,
    message: data.message,
    type: data.type || "system",
    recipientType: data.recipientType || "admin",
    recipientId: data.recipientId,
    relatedId: data.relatedId,
    isRead: "false",
  };
  const [result] = await db.insert(notifications).values(insertData).$returningId();
  return result.id;
}

export async function markAsRead(id: number) {
  await getDb()
    .update(notifications)
    .set({ isRead: "true" })
    .where(eq(notifications.id, id));
}

export async function markAllAsRead() {
  await getDb()
    .update(notifications)
    .set({ isRead: "true" })
    .where(eq(notifications.isRead, "false"));
}

export async function getUnreadCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(eq(notifications.isRead, "false"));
  return result[0]?.count || 0;
}

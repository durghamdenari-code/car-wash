import { getDb } from "./connection";
import { bookings } from "@db/schema";
import { eq, desc, like, and, sql, gte, lte } from "drizzle-orm";

export async function findAllBookings(
  search?: string,
  status?: string,
  dateFrom?: Date,
  dateTo?: Date
) {
  const db = getDb();
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(bookings.bookingNumber, `%${search}%`),
        like(bookings.customerName, `%${search}%`),
        like(bookings.customerPhone, `%${search}%`)
      )
    );
  }

  if (status) {
    conditions.push(eq(bookings.status, status as any));
  }

  if (dateFrom) {
    conditions.push(gte(bookings.scheduledDate, dateFrom));
  }

  if (dateTo) {
    conditions.push(lte(bookings.scheduledDate, dateTo));
  }

  return db
    .select()
    .from(bookings)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(bookings.createdAt));
}

export async function findBookingById(id: number) {
  return getDb()
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .then((rows) => rows[0] || null);
}

export async function findRecentBookings(limit: number = 10) {
  return getDb()
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(limit);
}

export async function createBooking(data: {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsappId?: string;
  carType: string;
  carModel?: string;
  carColor?: string;
  carPlate?: string;
  address?: string;
  lat?: string;
  lng?: string;
  serviceId: number;
  servicePrice: string;
  totalAmount: string;
  scheduledDate?: Date;
  customerNotes?: string;
  source?: string;
}) {
  const db = getDb();
  const insertData: any = {
    ...data,
    status: "pending",
    paymentStatus: "pending",
  };
  const [result] = await db.insert(bookings).values(insertData).$returningId();
  return findBookingById(result.id);
}

export async function updateBooking(
  id: number,
  data: any
) {
  await getDb()
    .update(bookings)
    .set(data)
    .where(eq(bookings.id, id));
  return findBookingById(id);
}

export async function assignWorker(bookingId: number, workerId: number) {
  return updateBooking(bookingId, {
    workerId,
    status: "assigned",
  });
}

export async function getTodayBookingsCount() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(gte(bookings.createdAt, today));
  return result[0]?.count || 0;
}

export async function getPendingBookingsCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "pending"));
  return result[0]?.count || 0;
}

export async function getInProgressBookingsCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "in_progress"));
  return result[0]?.count || 0;
}

export async function getCompletedBookingsCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "completed"));
  return result[0]?.count || 0;
}

export async function getTotalRevenue() {
  const result = await getDb()
    .select({ total: sql<string>`COALESCE(sum(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(eq(bookings.paymentStatus, "paid"));
  return parseFloat(result[0]?.total || "0");
}

export async function getTodayRevenue() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const result = await getDb()
    .select({ total: sql<string>`COALESCE(sum(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(
      and(
        gte(bookings.completedAt, today),
        eq(bookings.paymentStatus, "paid")
      )
    );
  return parseFloat(result[0]?.total || "0");
}

// Helper function for OR conditions
function or(...conditions: any[]) {
  return sql`(${conditions.join(" OR ")})`;
}

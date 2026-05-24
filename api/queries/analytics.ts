import { getDb } from "./connection";
import { bookings, workers, reviews, loyaltyPoints } from "@db/schema";
import { sql, gte, eq } from "drizzle-orm";

export async function getDashboardStats() {
  const db = getDb();

  // Total bookings
  const totalBookings = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings);

  // Today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayBookings = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(gte(bookings.createdAt, today));

  // Pending bookings
  const pendingBookings = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "pending"));

  // In progress bookings
  const inProgressBookings = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "in_progress"));

  // Completed bookings
  const completedBookings = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "completed"));

  // Total revenue (paid bookings)
  const totalRevenue = await db
    .select({ total: sql<string>`COALESCE(sum(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(eq(bookings.paymentStatus, "paid"));

  // Today's revenue
  const todayRevenue = await db
    .select({ total: sql<string>`COALESCE(sum(${bookings.totalAmount}), 0)` })
    .from(bookings)
    .where(
      sql`${bookings.completedAt} >= ${today} AND ${bookings.paymentStatus} = 'paid'`
    );

  // Active workers
  const activeWorkers = await db
    .select({ count: sql<number>`count(*)` })
    .from(workers)
    .where(eq(workers.status, "active"));

  // Total workers
  const totalWorkers = await db
    .select({ count: sql<number>`count(*)` })
    .from(workers);

  // Average rating
  const avgRating = await db
    .select({ avg: sql<string>`COALESCE(avg(${reviews.rating}), 0)` })
    .from(reviews);

  // Total reviews
  const totalReviews = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews);

  // Loyalty members
  const totalLoyaltyMembers = await db
    .select({ count: sql<number>`count(*)` })
    .from(loyaltyPoints);

  return {
    totalBookings: totalBookings[0]?.count || 0,
    todayBookings: todayBookings[0]?.count || 0,
    pendingBookings: pendingBookings[0]?.count || 0,
    inProgressBookings: inProgressBookings[0]?.count || 0,
    completedBookings: completedBookings[0]?.count || 0,
    totalRevenue: parseFloat(totalRevenue[0]?.total || "0"),
    todayRevenue: parseFloat(todayRevenue[0]?.total || "0"),
    activeWorkers: activeWorkers[0]?.count || 0,
    totalWorkers: totalWorkers[0]?.count || 0,
    averageRating: parseFloat(avgRating[0]?.avg || "0"),
    totalReviews: totalReviews[0]?.count || 0,
    totalLoyaltyMembers: totalLoyaltyMembers[0]?.count || 0,
  };
}

export async function getRevenueByDay(days: number = 7) {
  const db = getDb();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  fromDate.setHours(0, 0, 0, 0);

  const results = await db
    .select({
      date: sql<string>`DATE(${bookings.completedAt})`,
      revenue: sql<string>`COALESCE(sum(${bookings.totalAmount}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(bookings)
    .where(
      sql`${bookings.completedAt} >= ${fromDate} AND ${bookings.paymentStatus} = 'paid'`
    )
    .groupBy(sql`DATE(${bookings.completedAt})`)
    .orderBy(sql`DATE(${bookings.completedAt})`);

  return results;
}

export async function getBookingsByStatus() {
  const db = getDb();
  const results = await db
    .select({
      status: bookings.status,
      count: sql<number>`count(*)`,
    })
    .from(bookings)
    .groupBy(bookings.status);

  return results;
}

export async function getRecentActivity(limit: number = 10) {
  const db = getDb();
  const recentBookings = await db
    .select({
      id: bookings.id,
      type: sql<string>`'booking'`,
      message: sql<string>`CONCAT('New booking #', ${bookings.bookingNumber}, ' from ', ${bookings.customerName})`,
      status: bookings.status,
      createdAt: bookings.createdAt,
    })
    .from(bookings)
    .orderBy(desc(bookings.createdAt))
    .limit(limit);

  return recentBookings;
}

function desc(column: any) {
  return sql`${column} DESC`;
}

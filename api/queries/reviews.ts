import { getDb } from "./connection";
import { reviews } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function findAllReviews() {
  return getDb()
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt));
}

export async function findReviewById(id: number) {
  return getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .then((rows) => rows[0] || null);
}

export async function findReviewsByWorker(workerId: number) {
  return getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.workerId, workerId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: {
  bookingId: number;
  workerId?: number;
  customerName: string;
  customerPhone?: string;
  rating: number;
  comment?: string;
  tags?: string[];
}) {
  const db = getDb();
  const [result] = await db.insert(reviews).values(data).$returningId();
  return findReviewById(result.id);
}

export async function toggleReviewVisibility(id: number) {
  const review = await findReviewById(id);
  if (!review) return null;
  await getDb()
    .update(reviews)
    .set({ isVisible: review.isVisible === "true" ? "false" : "true" })
    .where(eq(reviews.id, id));
  return findReviewById(id);
}

export async function getAverageRating() {
  const result = await getDb()
    .select({ avg: sql<string>`avg(${reviews.rating})` })
    .from(reviews);
  return parseFloat(result[0]?.avg || "0");
}

export async function getTotalReviewsCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(reviews);
  return result[0]?.count || 0;
}

export async function getRatingDistribution() {
  const db = getDb();
  const results = await db
    .select({
      rating: reviews.rating,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .groupBy(reviews.rating);
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of results) {
    distribution[row.rating as 1 | 2 | 3 | 4 | 5] = row.count;
  }
  return distribution;
}

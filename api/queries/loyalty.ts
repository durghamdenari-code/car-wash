import { getDb } from "./connection";
import { loyaltyPoints } from "@db/schema";
import { eq, desc, like, sql } from "drizzle-orm";

export async function findAllLoyaltyMembers(search?: string) {
  const db = getDb();
  if (search) {
    return db
      .select()
      .from(loyaltyPoints)
      .where(like(loyaltyPoints.customerPhone, `%${search}%`))
      .orderBy(desc(loyaltyPoints.points));
  }
  return db
    .select()
    .from(loyaltyPoints)
    .orderBy(desc(loyaltyPoints.points));
}

export async function findLoyaltyByPhone(phone: string) {
  return getDb()
    .select()
    .from(loyaltyPoints)
    .where(eq(loyaltyPoints.customerPhone, phone))
    .then((rows) => rows[0] || null);
}

export async function findLoyaltyById(id: number) {
  return getDb()
    .select()
    .from(loyaltyPoints)
    .where(eq(loyaltyPoints.id, id))
    .then((rows) => rows[0] || null);
}

export async function upsertLoyalty(data: {
  customerPhone: string;
  customerName?: string;
  points: number;
  tier?: string;
  visits?: number;
}) {
  const db = getDb();
  const existing = await findLoyaltyByPhone(data.customerPhone);

  if (existing) {
    const newPoints = existing.points + data.points;
    const newEarned = existing.totalEarned + data.points;
    const newVisits = existing.visits + (data.visits || 1);
    const tier = calculateTier(newEarned);

    await db
      .update(loyaltyPoints)
      .set({
        points: newPoints,
        totalEarned: newEarned,
        visits: newVisits,
        tier: tier as any,
        lastVisit: new Date(),
        customerName: data.customerName || existing.customerName,
      })
      .where(eq(loyaltyPoints.id, existing.id));
    return findLoyaltyById(existing.id);
  } else {
    const tier = calculateTier(data.points);
    const [result] = await db.insert(loyaltyPoints).values({
      customerPhone: data.customerPhone,
      customerName: data.customerName,
      points: data.points,
      totalEarned: data.points,
      totalRedeemed: 0,
      tier: tier as any,
      visits: data.visits || 1,
      lastVisit: new Date(),
    }).$returningId();
    return findLoyaltyById(result.id);
  }
}

export async function redeemPoints(id: number, points: number) {
  const member = await findLoyaltyById(id);
  if (!member || member.points < points) return null;

  await getDb()
    .update(loyaltyPoints)
    .set({
      points: member.points - points,
      totalRedeemed: member.totalRedeemed + points,
    })
    .where(eq(loyaltyPoints.id, id));
  return findLoyaltyById(id);
}

function calculateTier(totalEarned: number): string {
  if (totalEarned >= 2000) return "platinum";
  if (totalEarned >= 1000) return "gold";
  if (totalEarned >= 500) return "silver";
  return "bronze";
}

export async function getLoyaltyStats() {
  const db = getDb();
  const totalMembers = await db
    .select({ count: sql<number>`count(*)` })
    .from(loyaltyPoints);
  
  const totalPoints = await db
    .select({ sum: sql<number>`sum(${loyaltyPoints.points})` })
    .from(loyaltyPoints);

  const tierCounts = await db
    .select({
      tier: loyaltyPoints.tier,
      count: sql<number>`count(*)`,
    })
    .from(loyaltyPoints)
    .groupBy(loyaltyPoints.tier);

  return {
    totalMembers: totalMembers[0]?.count || 0,
    totalPoints: totalPoints[0]?.sum || 0,
    tierCounts,
  };
}

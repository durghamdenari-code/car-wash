import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  int,
  json,
} from "drizzle-orm/mysql-core";

// ==================== USERS (Auth) ====================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ==================== WORKERS ====================
export const workers = mysqlTable("workers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  status: mysqlEnum("status", ["active", "inactive", "busy", "offline"]).default("active").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("5.0").notNull(),
  totalJobs: int("totalJobs").default(0).notNull(),
  currentLat: decimal("currentLat", { precision: 10, scale: 6 }),
  currentLng: decimal("currentLng", { precision: 10, scale: 6 }),
  vehicleType: varchar("vehicleType", { length: 100 }),
  vehiclePlate: varchar("vehiclePlate", { length: 50 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;

// ==================== SERVICES ====================
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }),
  description: text("description"),
  category: mysqlEnum("category", ["exterior", "interior", "full", "premium", "detailing"]).default("exterior").notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  duration: int("duration").notNull(), // in minutes
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ==================== BOOKINGS ====================
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  bookingNumber: varchar("bookingNumber", { length: 50 }).notNull().unique(),
  // Customer info (from WhatsApp)
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerWhatsappId: varchar("customerWhatsappId", { length: 255 }),
  // Car details
  carType: varchar("carType", { length: 100 }).notNull(),
  carModel: varchar("carModel", { length: 100 }),
  carColor: varchar("carColor", { length: 50 }),
  carPlate: varchar("carPlate", { length: 50 }),
  // Location
  address: text("address"),
  lat: decimal("lat", { precision: 10, scale: 6 }),
  lng: decimal("lng", { precision: 10, scale: 6 }),
  // Service
  serviceId: bigint("serviceId", { mode: "number", unsigned: true }).notNull(),
  // Worker assignment
  workerId: bigint("workerId", { mode: "number", unsigned: true }),
  // Status & timing
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "assigned",
    "in_progress",
    "completed",
    "cancelled",
    "no_show",
  ]).default("pending").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  // Pricing
  servicePrice: decimal("servicePrice", { precision: 10, scale: 2 }).notNull(),
  tipAmount: decimal("tipAmount", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  // Payment
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "wallet", "online"]),
  // Photos
  beforePhotos: json("beforePhotos").$type<string[]>(),
  afterPhotos: json("afterPhotos").$type<string[]>(),
  // Notes
  customerNotes: text("customerNotes"),
  adminNotes: text("adminNotes"),
  // Source
  source: mysqlEnum("source", ["whatsapp", "app", "phone", "walk_in"]).default("whatsapp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ==================== REVIEWS ====================
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  workerId: bigint("workerId", { mode: "number", unsigned: true }),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  tags: json("tags").$type<string[]>(), // ["fast", "professional", "thorough"]
  isVisible: mysqlEnum("isVisible", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ==================== LOYALTY POINTS ====================
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: serial("id").primaryKey(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerName: varchar("customerName", { length: 255 }),
  points: int("points").default(0).notNull(),
  totalEarned: int("totalEarned").default(0).notNull(),
  totalRedeemed: int("totalRedeemed").default(0).notNull(),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  visits: int("visits").default(0).notNull(),
  lastVisit: timestamp("lastVisit"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type LoyaltyPoint = typeof loyaltyPoints.$inferSelect;
export type InsertLoyaltyPoint = typeof loyaltyPoints.$inferInsert;

// ==================== NOTIFICATIONS ====================
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["booking", "payment", "worker", "system", "review", "promotion"]).default("system").notNull(),
  recipientType: mysqlEnum("recipientType", ["admin", "worker", "customer"]).default("admin").notNull(),
  recipientId: varchar("recipientId", { length: 255 }), // phone or id
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  relatedId: bigint("relatedId", { mode: "number", unsigned: true }), // booking id etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ==================== PAYMENTS ====================
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["cash", "card", "wallet", "online"]).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

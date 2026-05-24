import "dotenv/config";
import { getDb } from "../api/queries/connection";
import { workers, services, bookings, reviews, loyaltyPoints, notifications } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(reviews);
  await db.delete(bookings);
  await db.delete(loyaltyPoints);
  await db.delete(notifications);
  await db.delete(workers);
  await db.delete(services);

  // Seed Workers
  console.log("Seeding workers...");
  const workerData = [
    { name: "Ahmed Hassan", phone: "+201012345670", email: "ahmed@washy.com", status: "active" as const, rating: "4.8", totalJobs: 156, vehicleType: "Van", vehiclePlate: "ABC-1234" },
    { name: "Mohamed Ali", phone: "+201012345671", email: "mohamed@washy.com", status: "active" as const, rating: "4.9", totalJobs: 203, vehicleType: "Pickup", vehiclePlate: "XYZ-5678" },
    { name: "Karim Fathy", phone: "+201012345672", email: "karim@washy.com", status: "busy" as const, rating: "4.7", totalJobs: 89, vehicleType: "Van", vehiclePlate: "KLM-9012" },
    { name: "Omar Said", phone: "+201012345673", email: "omar@washy.com", status: "active" as const, rating: "4.6", totalJobs: 134, vehicleType: "Truck", vehiclePlate: "DEF-3456" },
    { name: "Youssef Khaled", phone: "+201012345674", email: "youssef@washy.com", status: "active" as const, rating: "5.0", totalJobs: 67, vehicleType: "Van", vehiclePlate: "GHI-7890" },
    { name: "Islam Nasser", phone: "+201012345675", email: "islam@washy.com", status: "inactive" as const, rating: "4.5", totalJobs: 45, vehicleType: "Pickup", vehiclePlate: "JKL-1234" },
    { name: "Mahmoud Samir", phone: "+201012345676", email: "mahmoud@washy.com", status: "active" as const, rating: "4.8", totalJobs: 178, vehicleType: "Van", vehiclePlate: "MNO-5678" },
    { name: "Tarek Hossam", phone: "+201012345677", email: "tarek@washy.com", status: "offline" as const, rating: "4.4", totalJobs: 92, vehicleType: "Truck", vehiclePlate: "PQR-9012" },
  ];

  for (const w of workerData) {
    await db.insert(workers).values(w);
  }

  // Seed Services
  console.log("Seeding services...");
  const serviceData = [
    { name: "Quick Wash", nameAr: "غسيل سريع", description: "Exterior wash with foam and dry", category: "exterior" as const, basePrice: "50.00", duration: 20, icon: "SprayCan", color: "#3b82f6" },
    { name: "Full Exterior", nameAr: "غسيل خارجي كامل", description: "Detailed exterior wash, wax, and tire shine", category: "exterior" as const, basePrice: "80.00", duration: 35, icon: "Car", color: "#10b981" },
    { name: "Interior Clean", nameAr: "تنظيف داخلي", description: "Vacuum, dashboard clean, and window wipe", category: "interior" as const, basePrice: "70.00", duration: 30, icon: "Armchair", color: "#f59e0b" },
    { name: "Full Package", nameAr: "الباقة الشاملة", description: "Complete interior and exterior detailing", category: "full" as const, basePrice: "150.00", duration: 60, icon: "Sparkles", color: "#8b5cf6" },
    { name: "Premium Detail", nameAr: "تلميع ممتاز", description: "Full detail with ceramic coating prep", category: "premium" as const, basePrice: "250.00", duration: 90, icon: "Crown", color: "#ec4899" },
    { name: "Engine Bay", nameAr: "تنظيف المحرك", description: "Engine bay deep cleaning and dressing", category: "detailing" as const, basePrice: "120.00", duration: 45, icon: "Cog", color: "#06b6d4" },
    { name: "Seat Deep Clean", nameAr: "تنظيف مقاعد عميق", description: "Deep leather/fabric seat cleaning", category: "interior" as const, basePrice: "100.00", duration: 40, icon: "Droplets", color: "#14b8a6" },
    { name: "Polish & Wax", nameAr: "تلميع و واكس", description: "Paint correction and protective wax", category: "premium" as const, basePrice: "200.00", duration: 75, icon: "Gem", color: "#f97316" },
  ];

  for (const s of serviceData) {
    await db.insert(services).values(s);
  }

  // Seed Bookings
  console.log("Seeding bookings...");
  const bookingData = [
    { bookingNumber: "WASH-2024-001", customerName: "Sherif Ahmed", customerPhone: "+201098765432", carType: "Sedan", carModel: "Toyota Corolla", carColor: "White", carPlate: "ABC-1234", serviceId: 4, servicePrice: "150.00", totalAmount: "150.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "online" as const, source: "whatsapp" as const, address: "12 Tahrir St, Downtown", customerNotes: "Please be careful with the rims" },
    { bookingNumber: "WASH-2024-002", customerName: "Mona Salah", customerPhone: "+201112223344", carType: "SUV", carModel: "Hyundai Tucson", carColor: "Black", carPlate: "XYZ-5678", serviceId: 3, servicePrice: "70.00", totalAmount: "70.00", status: "in_progress" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "45 Mohandessin, Giza", workerId: 1 },
    { bookingNumber: "WASH-2024-003", customerName: "Hani Gomaa", customerPhone: "+201223344556", carType: "Hatchback", carModel: "VW Golf", carColor: "Red", carPlate: "DEF-9012", serviceId: 2, servicePrice: "80.00", totalAmount: "80.00", status: "assigned" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "78 Nasr City, Cairo", workerId: 2 },
    { bookingNumber: "WASH-2024-004", customerName: "Fatima Omar", customerPhone: "+201334455667", carType: "Sedan", carModel: "Honda Civic", carColor: "Silver", carPlate: "GHI-3456", serviceId: 1, servicePrice: "50.00", totalAmount: "50.00", status: "pending" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "23 Zamalek, Cairo" },
    { bookingNumber: "WASH-2024-005", customerName: "Wael Karam", customerPhone: "+201445566778", carType: "SUV", carModel: "Kia Sportage", carColor: "Blue", carPlate: "JKL-7890", serviceId: 5, servicePrice: "250.00", totalAmount: "270.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, source: "whatsapp" as const, address: "90 Maadi, Cairo", workerId: 3, tipAmount: "20.00" },
    { bookingNumber: "WASH-2024-006", customerName: "Nadia Fathy", customerPhone: "+201556677889", carType: "Sedan", carModel: "Nissan Sunny", carColor: "Gray", carPlate: "MNO-1234", serviceId: 4, servicePrice: "150.00", totalAmount: "150.00", status: "confirmed" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "34 Heliopolis, Cairo", workerId: 4 },
    { bookingNumber: "WASH-2024-007", customerName: "Tamer Hosny", customerPhone: "+201667788990", carType: "Truck", carModel: "Toyota Hilux", carColor: "White", carPlate: "PQR-5678", serviceId: 6, servicePrice: "120.00", totalAmount: "120.00", status: "pending" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "56 6th October, Giza" },
    { bookingNumber: "WASH-2024-008", customerName: "Laila Mansour", customerPhone: "+201778899001", carType: "SUV", carModel: "BMW X5", carColor: "Black", carPlate: "STU-9012", serviceId: 8, servicePrice: "200.00", totalAmount: "220.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "online" as const, source: "whatsapp" as const, address: "67 New Cairo", workerId: 5, tipAmount: "20.00" },
    { bookingNumber: "WASH-2024-009", customerName: "Rami Said", customerPhone: "+201889900112", carType: "Sedan", carModel: "Mercedes C200", carColor: "Silver", carPlate: "VWX-3456", serviceId: 4, servicePrice: "150.00", totalAmount: "150.00", status: "in_progress" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "88 Sheikh Zayed", workerId: 6 },
    { bookingNumber: "WASH-2024-010", customerName: "Dina Kareem", customerPhone: "+201990011223", carType: "Hatchback", carModel: "Fiat 500", carColor: "Pink", carPlate: "YZA-7890", serviceId: 1, servicePrice: "50.00", totalAmount: "50.00", status: "pending" as const, paymentStatus: "pending" as const, source: "whatsapp" as const, address: "99 Rehab City" },
    { bookingNumber: "WASH-2024-011", customerName: "Amr Diab", customerPhone: "+201001122334", carType: "SUV", carModel: "Range Rover", carColor: "White", carPlate: "BCD-1234", serviceId: 5, servicePrice: "250.00", totalAmount: "280.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "card" as const, source: "whatsapp" as const, address: "11 Garden City", workerId: 7, tipAmount: "30.00" },
    { bookingNumber: "WASH-2024-012", customerName: "Samar Tarek", customerPhone: "+201112233445", carType: "Sedan", carModel: "Hyundai Elantra", carColor: "Blue", carPlate: "EFG-5678", serviceId: 2, servicePrice: "80.00", totalAmount: "80.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "cash" as const, source: "walk_in" as const, address: "22 Dokki, Giza", workerId: 1 },
    { bookingNumber: "WASH-2024-013", customerName: "Hesham Abbas", customerPhone: "+201223344556", carType: "SUV", carModel: "Jeep Wrangler", carColor: "Green", carPlate: "HIJ-9012", serviceId: 7, servicePrice: "100.00", totalAmount: "100.00", status: "cancelled" as const, paymentStatus: "refunded" as const, source: "whatsapp" as const, address: "33 Madinaty" },
    { bookingNumber: "WASH-2024-014", customerName: "Nour El Din", customerPhone: "+201334455667", carType: "Sedan", carModel: "Kia Cerato", carColor: "Red", carPlate: "KLM-3456", serviceId: 3, servicePrice: "70.00", totalAmount: "70.00", status: "completed" as const, paymentStatus: "paid" as const, paymentMethod: "online" as const, source: "whatsapp" as const, address: "44 Sheraton", workerId: 4 },
    { bookingNumber: "WASH-2024-015", customerName: "Aya Mostafa", customerPhone: "+201445566778", carType: "Hatchback", carModel: "Peugeot 208", carColor: "White", carPlate: "NOP-7890", serviceId: 4, servicePrice: "150.00", totalAmount: "150.00", status: "confirmed" as const, paymentStatus: "pending" as const, source: "app" as const, address: "55 Fifth Settlement", workerId: 2 },
  ];

  for (const b of bookingData) {
    await db.insert(bookings).values(b);
  }

  // Seed Reviews
  console.log("Seeding reviews...");
  const reviewData = [
    { bookingId: 1, workerId: 4, customerName: "Sherif Ahmed", customerPhone: "+201098765432", rating: 5, comment: "Excellent service! My car looks brand new. Highly recommend!", tags: ["professional", "thorough", "fast"] },
    { bookingId: 5, workerId: 3, customerName: "Wael Karam", customerPhone: "+201445566778", rating: 5, comment: "Premium service worth every penny. The ceramic prep was amazing.", tags: ["premium", "detailed"] },
    { bookingId: 8, workerId: 5, customerName: "Laila Mansour", customerPhone: "+201778899001", rating: 4, comment: "Great polishing job. Took a bit longer than expected but results are fantastic.", tags: ["quality", "polite"] },
    { bookingId: 11, workerId: 7, customerName: "Amr Diab", customerPhone: "+201001122334", rating: 5, comment: "The team was very professional. Will definitely book again!", tags: ["professional", "on_time"] },
    { bookingId: 12, workerId: 1, customerName: "Samar Tarek", customerPhone: "+201112233445", rating: 5, comment: "Quick and efficient. Love the convenience of not going anywhere!", tags: ["fast", "convenient"] },
    { bookingId: 14, workerId: 4, customerName: "Nour El Din", customerPhone: "+201334455667", rating: 4, comment: "Good interior cleaning. They even cleaned under the seats!", tags: ["thorough", "careful"] },
    { bookingId: 2, workerId: 1, customerName: "Mona Salah", customerPhone: "+201112223344", rating: 5, comment: "Mohamed was very friendly and did an amazing job on my SUV!", tags: ["friendly", "professional"] },
    { bookingId: 3, workerId: 2, customerName: "Hani Gomaa", customerPhone: "+201223344556", rating: 4, comment: "Great exterior wash. The wax made my car shine for days.", tags: ["quality", "shiny"] },
  ];

  for (const r of reviewData) {
    await db.insert(reviews).values(r);
  }

  // Seed Loyalty Points
  console.log("Seeding loyalty points...");
  const loyaltyData = [
    { customerPhone: "+201098765432", customerName: "Sherif Ahmed", points: 350, totalEarned: 550, totalRedeemed: 200, tier: "silver" as const, visits: 8 },
    { customerPhone: "+201112223344", customerName: "Mona Salah", points: 120, totalEarned: 220, totalRedeemed: 100, tier: "bronze" as const, visits: 4 },
    { customerPhone: "+201445566778", customerName: "Wael Karam", points: 800, totalEarned: 1200, totalRedeemed: 400, tier: "gold" as const, visits: 15 },
    { customerPhone: "+201778899001", customerName: "Laila Mansour", points: 150, totalEarned: 250, totalRedeemed: 100, tier: "bronze" as const, visits: 5 },
    { customerPhone: "+201001122334", customerName: "Amr Diab", points: 1200, totalEarned: 2000, totalRedeemed: 800, tier: "platinum" as const, visits: 25 },
    { customerPhone: "+201334455667", customerName: "Nour El Din", points: 200, totalEarned: 350, totalRedeemed: 150, tier: "bronze" as const, visits: 6 },
    { customerPhone: "+201556677889", customerName: "Nadia Fathy", points: 450, totalEarned: 650, totalRedeemed: 200, tier: "silver" as const, visits: 10 },
    { customerPhone: "+201667788990", customerName: "Tamer Hosny", points: 80, totalEarned: 120, totalRedeemed: 40, tier: "bronze" as const, visits: 2 },
    { customerPhone: "+201889900112", customerName: "Rami Said", points: 600, totalEarned: 900, totalRedeemed: 300, tier: "gold" as const, visits: 12 },
    { customerPhone: "+201990011223", customerName: "Dina Kareem", points: 50, totalEarned: 50, totalRedeemed: 0, tier: "bronze" as const, visits: 1 },
  ];

  for (const l of loyaltyData) {
    await db.insert(loyaltyPoints).values(l);
  }

  // Seed Notifications
  console.log("Seeding notifications...");
  const notificationData = [
    { title: "New Booking", message: "New booking #WASH-2024-016 from Khaled Ibrahim - Sedan", type: "booking" as const, recipientType: "admin" as const, relatedId: 16 },
    { title: "Worker Assigned", message: "Ahmed Hassan assigned to booking #WASH-2024-003", type: "worker" as const, recipientType: "admin" as const, relatedId: 3 },
    { title: "Payment Received", message: "Payment of EGP 150 received for booking #WASH-2024-001", type: "payment" as const, recipientType: "admin" as const, relatedId: 1 },
    { title: "New Review", message: "5-star review from Sherif Ahmed for booking #WASH-2024-001", type: "review" as const, recipientType: "admin" as const, relatedId: 1 },
    { title: "Booking Cancelled", message: "Booking #WASH-2024-013 cancelled by customer", type: "booking" as const, recipientType: "admin" as const, relatedId: 13 },
    { title: "Worker Status", message: "Karim Fathy is now busy with booking #WASH-2024-002", type: "worker" as const, recipientType: "admin" as const, relatedId: 2 },
    { title: "Payment Failed", message: "Online payment failed for booking #WASH-2024-009", type: "payment" as const, recipientType: "admin" as const, relatedId: 9 },
    { title: "New Platinum Member", message: "Amr Diab has reached Platinum tier!", type: "system" as const, recipientType: "admin" as const },
  ];

  for (const n of notificationData) {
    await db.insert(notifications).values(n);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);

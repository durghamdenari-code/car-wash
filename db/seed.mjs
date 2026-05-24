import { createConnection } from 'mysql2/promise';

const db = await createConnection({
  uri: 'mysql://3BWH4cZzcQ2HMnH.root:3KDNtQr0PaQL1Dd6OfdMcHUoYNeDlUEn@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19e5bdb7-84e2-842b-8000-098dad5dbafa?ssl={"rejectUnauthorized":true}',
});

console.log("Seeding...");

// Clear data
await db.execute("DELETE FROM reviews");
await db.execute("DELETE FROM bookings");
await db.execute("DELETE FROM loyaltyPoints");
await db.execute("DELETE FROM notifications");
await db.execute("DELETE FROM workers");
await db.execute("DELETE FROM services");

// Workers
await db.execute(`
  INSERT INTO workers (name, phone, email, status, rating, totalJobs, vehicleType, vehiclePlate) VALUES
  ('Ahmed Hassan', '+201012345670', 'ahmed@washy.com', 'active', '4.8', 156, 'Van', 'ABC-1234'),
  ('Mohamed Ali', '+201012345671', 'mohamed@washy.com', 'active', '4.9', 203, 'Pickup', 'XYZ-5678'),
  ('Karim Fathy', '+201012345672', 'karim@washy.com', 'busy', '4.7', 89, 'Van', 'KLM-9012'),
  ('Omar Said', '+201012345673', 'omar@washy.com', 'active', '4.6', 134, 'Truck', 'DEF-3456'),
  ('Youssef Khaled', '+201012345674', 'youssef@washy.com', 'active', '5.0', 67, 'Van', 'GHI-7890'),
  ('Islam Nasser', '+201012345675', 'islam@washy.com', 'inactive', '4.5', 45, 'Pickup', 'JKL-1234'),
  ('Mahmoud Samir', '+201012345676', 'mahmoud@washy.com', 'active', '4.8', 178, 'Van', 'MNO-5678'),
  ('Tarek Hossam', '+201012345677', 'tarek@washy.com', 'offline', '4.4', 92, 'Truck', 'PQR-9012')
`);

// Services
await db.execute(`
  INSERT INTO services (name, nameAr, description, category, basePrice, duration, icon, color) VALUES
  ('Quick Wash', 'غسيل سريع', 'Exterior wash with foam and dry', 'exterior', '50.00', 20, 'SprayCan', '#3b82f6'),
  ('Full Exterior', 'غسيل خارجي كامل', 'Detailed exterior wash, wax, and tire shine', 'exterior', '80.00', 35, 'Car', '#10b981'),
  ('Interior Clean', 'تنظيف داخلي', 'Vacuum, dashboard clean, and window wipe', 'interior', '70.00', 30, 'Armchair', '#f59e0b'),
  ('Full Package', 'الباقة الشاملة', 'Complete interior and exterior detailing', 'full', '150.00', 60, 'Sparkles', '#8b5cf6'),
  ('Premium Detail', 'تلميع ممتاز', 'Full detail with ceramic coating prep', 'premium', '250.00', 90, 'Crown', '#ec4899'),
  ('Engine Bay', 'تنظيف المحرك', 'Engine bay deep cleaning and dressing', 'detailing', '120.00', 45, 'Cog', '#06b6d4'),
  ('Seat Deep Clean', 'تنظيف مقاعد عميق', 'Deep leather/fabric seat cleaning', 'interior', '100.00', 40, 'Droplets', '#14b8a6'),
  ('Polish & Wax', 'تلميع و واكس', 'Paint correction and protective wax', 'premium', '200.00', 75, 'Gem', '#f97316')
`);

// Bookings
await db.execute(`
  INSERT INTO bookings (bookingNumber, customerName, customerPhone, carType, carModel, carColor, carPlate, serviceId, servicePrice, totalAmount, status, paymentStatus, paymentMethod, source, address, customerNotes, workerId, tipAmount) VALUES
  ('WASH-2024-001', 'Sherif Ahmed', '+201098765432', 'Sedan', 'Toyota Corolla', 'White', 'ABC-1234', 4, '150.00', '150.00', 'completed', 'paid', 'online', 'whatsapp', '12 Tahrir St, Downtown', 'Please be careful with the rims', NULL, NULL),
  ('WASH-2024-002', 'Mona Salah', '+201112223344', 'SUV', 'Hyundai Tucson', 'Black', 'XYZ-5678', 3, '70.00', '70.00', 'in_progress', 'pending', NULL, 'whatsapp', '45 Mohandessin, Giza', NULL, 1, NULL),
  ('WASH-2024-003', 'Hani Gomaa', '+201223344556', 'Hatchback', 'VW Golf', 'Red', 'DEF-9012', 2, '80.00', '80.00', 'assigned', 'pending', NULL, 'whatsapp', '78 Nasr City, Cairo', NULL, 2, NULL),
  ('WASH-2024-004', 'Fatima Omar', '+201334455667', 'Sedan', 'Honda Civic', 'Silver', 'GHI-3456', 1, '50.00', '50.00', 'pending', 'pending', NULL, 'whatsapp', '23 Zamalek, Cairo', NULL, NULL, NULL),
  ('WASH-2024-005', 'Wael Karam', '+201445566778', 'SUV', 'Kia Sportage', 'Blue', 'JKL-7890', 5, '250.00', '270.00', 'completed', 'paid', 'card', 'whatsapp', '90 Maadi, Cairo', NULL, 3, '20.00'),
  ('WASH-2024-006', 'Nadia Fathy', '+201556677889', 'Sedan', 'Nissan Sunny', 'Gray', 'MNO-1234', 4, '150.00', '150.00', 'confirmed', 'pending', NULL, 'whatsapp', '34 Heliopolis, Cairo', NULL, 4, NULL),
  ('WASH-2024-007', 'Tamer Hosny', '+201667788990', 'Truck', 'Toyota Hilux', 'White', 'PQR-5678', 6, '120.00', '120.00', 'pending', 'pending', NULL, 'whatsapp', '56 6th October, Giza', NULL, NULL, NULL),
  ('WASH-2024-008', 'Laila Mansour', '+201778899001', 'SUV', 'BMW X5', 'Black', 'STU-9012', 8, '200.00', '220.00', 'completed', 'paid', 'online', 'whatsapp', '67 New Cairo', NULL, 5, '20.00'),
  ('WASH-2024-009', 'Rami Said', '+201889900112', 'Sedan', 'Mercedes C200', 'Silver', 'VWX-3456', 4, '150.00', '150.00', 'in_progress', 'pending', NULL, 'whatsapp', '88 Sheikh Zayed', NULL, 6, NULL),
  ('WASH-2024-010', 'Dina Kareem', '+201990011223', 'Hatchback', 'Fiat 500', 'Pink', 'YZA-7890', 1, '50.00', '50.00', 'pending', 'pending', NULL, 'whatsapp', '99 Rehab City', NULL, NULL, NULL),
  ('WASH-2024-011', 'Amr Diab', '+201001122334', 'SUV', 'Range Rover', 'White', 'BCD-1234', 5, '250.00', '280.00', 'completed', 'paid', 'card', 'whatsapp', '11 Garden City', NULL, 7, '30.00'),
  ('WASH-2024-012', 'Samar Tarek', '+201112233445', 'Sedan', 'Hyundai Elantra', 'Blue', 'EFG-5678', 2, '80.00', '80.00', 'completed', 'paid', 'cash', 'walk_in', '22 Dokki, Giza', NULL, 1, NULL),
  ('WASH-2024-013', 'Hesham Abbas', '+201223344556', 'SUV', 'Jeep Wrangler', 'Green', 'HIJ-9012', 7, '100.00', '100.00', 'cancelled', 'refunded', NULL, 'whatsapp', '33 Madinaty', NULL, NULL, NULL),
  ('WASH-2024-014', 'Nour El Din', '+201334455667', 'Sedan', 'Kia Cerato', 'Red', 'KLM-3456', 3, '70.00', '70.00', 'completed', 'paid', 'online', 'whatsapp', '44 Sheraton', NULL, 4, NULL),
  ('WASH-2024-015', 'Aya Mostafa', '+201445566778', 'Hatchback', 'Peugeot 208', 'White', 'NOP-7890', 4, '150.00', '150.00', 'confirmed', 'pending', NULL, 'app', '55 Fifth Settlement', NULL, 2, NULL)
`);

// Reviews
await db.execute(`
  INSERT INTO reviews (bookingId, workerId, customerName, customerPhone, rating, comment, tags) VALUES
  (1, 4, 'Sherif Ahmed', '+201098765432', 5, 'Excellent service! My car looks brand new. Highly recommend!', '["professional", "thorough", "fast"]'),
  (5, 3, 'Wael Karam', '+201445566778', 5, 'Premium service worth every penny. The ceramic prep was amazing.', '["premium", "detailed"]'),
  (8, 5, 'Laila Mansour', '+201778899001', 4, 'Great polishing job. Took a bit longer than expected but results are fantastic.', '["quality", "polite"]'),
  (11, 7, 'Amr Diab', '+201001122334', 5, 'The team was very professional. Will definitely book again!', '["professional", "on_time"]'),
  (12, 1, 'Samar Tarek', '+201112233445', 5, 'Quick and efficient. Love the convenience of not going anywhere!', '["fast", "convenient"]'),
  (14, 4, 'Nour El Din', '+201334455667', 4, 'Good interior cleaning. They even cleaned under the seats!', '["thorough", "careful"]'),
  (2, 1, 'Mona Salah', '+201112223344', 5, 'Mohamed was very friendly and did an amazing job on my SUV!', '["friendly", "professional"]'),
  (3, 2, 'Hani Gomaa', '+201223344556', 4, 'Great exterior wash. The wax made my car shine for days.', '["quality", "shiny"]')
`);

// Loyalty
await db.execute(`
  INSERT INTO loyaltyPoints (customerPhone, customerName, points, totalEarned, totalRedeemed, tier, visits) VALUES
  ('+201098765432', 'Sherif Ahmed', 350, 550, 200, 'silver', 8),
  ('+201112223344', 'Mona Salah', 120, 220, 100, 'bronze', 4),
  ('+201445566778', 'Wael Karam', 800, 1200, 400, 'gold', 15),
  ('+201778899001', 'Laila Mansour', 150, 250, 100, 'bronze', 5),
  ('+201001122334', 'Amr Diab', 1200, 2000, 800, 'platinum', 25),
  ('+201334455667', 'Nour El Din', 200, 350, 150, 'bronze', 6),
  ('+201556677889', 'Nadia Fathy', 450, 650, 200, 'silver', 10),
  ('+201667788990', 'Tamer Hosny', 80, 120, 40, 'bronze', 2),
  ('+201889900112', 'Rami Said', 600, 900, 300, 'gold', 12),
  ('+201990011223', 'Dina Kareem', 50, 50, 0, 'bronze', 1)
`);

// Notifications
await db.execute(`
  INSERT INTO notifications (title, message, type, recipientType, relatedId) VALUES
  ('New Booking', 'New booking from Khaled Ibrahim - Sedan', 'booking', 'admin', 16),
  ('Worker Assigned', 'Ahmed Hassan assigned to booking #WASH-2024-003', 'worker', 'admin', 3),
  ('Payment Received', 'Payment of EGP 150 received for booking #WASH-2024-001', 'payment', 'admin', 1),
  ('New Review', '5-star review from Sherif Ahmed for booking #WASH-2024-001', 'review', 'admin', 1),
  ('Booking Cancelled', 'Booking #WASH-2024-013 cancelled by customer', 'booking', 'admin', 13),
  ('Worker Status', 'Karim Fathy is now busy with booking #WASH-2024-002', 'worker', 'admin', 2),
  ('Payment Failed', 'Online payment failed for booking #WASH-2024-009', 'payment', 'admin', 9),
  ('New Platinum Member', 'Amr Diab has reached Platinum tier!', 'system', 'admin', NULL)
`);

console.log("Seeding complete!");
await db.end();

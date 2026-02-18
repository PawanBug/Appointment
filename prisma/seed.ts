import { PrismaClient, ROLE, BOOKINGSTATUS } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear database (order matters because of relations)
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // =========================
  // USERS
  // =========================

  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@test.com",
      username: "admin",
      password: hashedPassword,
      role: ROLE.ADMIN,
      country: "Nepal",
      timezone: "Asia/Kathmandu",
      phoneNumber: "9800000001",
    },
  });

  const provider = await prisma.user.create({
    data: {
      name: "Dr. Ram Sharma",
      email: "provider@test.com",
      username: "drsharma",
      password: hashedPassword,
      role: ROLE.PROVIDER,
      country: "Nepal",
      timezone: "Asia/Kathmandu",
      phoneNumber: "9800000002",
      bio: "General Physician",
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "John Client",
      email: "client@test.com",
      username: "johnclient",
      password: hashedPassword,
      role: ROLE.CLIENT,
      country: "India",
      timezone: "Asia/Kolkata",
      phoneNumber: "9800000003",
    },
  });

  // =========================
  // AVAILABILITY RULES
  // =========================

  const rule1 = await prisma.availabilityRule.create({
    data: {
      userId: provider.id,
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      slotSize: 30,
    },
  });

  const rule2 = await prisma.availabilityRule.create({
    data: {
      userId: provider.id,
      dayOfWeek: 2,
      startTime: "10:00",
      endTime: "16:00",
      slotSize: 30,
    },
  });

  const rule3 = await prisma.availabilityRule.create({
    data: {
      userId: provider.id,
      dayOfWeek: 3,
      startTime: "08:00",
      endTime: "14:00",
      slotSize: 20,
    },
  });

  // =========================
  // AVAILABILITY EXCEPTIONS
  // =========================

  const exception1 = await prisma.availabilityException.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-01"),
      reason: "Public Holiday",
    },
  });

  const exception2 = await prisma.availabilityException.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-05"),
      startTime: new Date("2026-03-05T12:00:00Z"),
      endTime: new Date("2026-03-05T15:00:00Z"),
      reason: "Personal Leave",
    },
  });

  const exception3 = await prisma.availabilityException.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-10"),
      reason: "Conference",
    },
  });

  // =========================
  // TIME SLOTS
  // =========================

  const slot1 = await prisma.timeSlot.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-03"),
      startTime: new Date("2026-03-03T09:00:00Z"),
      endTime: new Date("2026-03-03T09:30:00Z"),
      isBooked: true,
    },
  });

  const slot2 = await prisma.timeSlot.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-03"),
      startTime: new Date("2026-03-03T10:00:00Z"),
      endTime: new Date("2026-03-03T10:30:00Z"),
      isBooked: true,
    },
  });

  const slot3 = await prisma.timeSlot.create({
    data: {
      userId: provider.id,
      date: new Date("2026-03-04"),
      startTime: new Date("2026-03-04T11:00:00Z"),
      endTime: new Date("2026-03-04T11:30:00Z"),
      isBooked: true,
    },
  });

  // =========================
  // BOOKINGS
  // =========================

  await prisma.booking.create({
    data: {
      providerId: provider.id,
      clientId: client.id,
      timeSlotId: slot1.id,
      Status: BOOKINGSTATUS.ACCEPTED,
      notes: "General Consultation",
    },
  });

  await prisma.booking.create({
    data: {
      providerId: provider.id,
      clientId: client.id,
      timeSlotId: slot2.id,
      Status: BOOKINGSTATUS.PENDING,
      notes: "Skin Checkup",
    },
  });

  await prisma.booking.create({
    data: {
      providerId: provider.id,
      clientId: client.id,
      timeSlotId: slot3.id,
      Status: BOOKINGSTATUS.CANCELLED,
      notes: "Follow-up Visit",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

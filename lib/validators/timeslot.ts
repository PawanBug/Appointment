import z from "zod";
import { bookingBaseSchema } from "./booking";

export const createTimeSlotSchema = z
  .object({
    userId: z.string().min(1, "UserID must be greater than 1 character."),
    date: z.coerce.date(),
    startTime: z.number().int().min(0).max(1440),
    endTime: z.number().int().min(0).max(1440),
    isBooked: z.boolean(),
    bookingId: z.string(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Endtime must be greater than start-time.",
    path: ["endTime"],
  });

export const timeSlotBaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  startTime: z.number().int(),
  endTime: z.number().int(),
  isBooked: z.boolean(),
  bookingId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const timeSlotWithBookingsSchema = timeSlotBaseSchema.extend({
  bookings: z.array(bookingBaseSchema),
});

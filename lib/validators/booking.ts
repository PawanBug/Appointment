import z from "zod";
import { timeSlotBaseSchema } from "./timeslot";
import { userTypeSchema } from "./user-validation";

export const createbookingSchema = z.object({
  providerId: z.string().min(1),
  clientId: z.string().min(1),
  timeSlotId: z.string().min(1).nullable(),
  Status: z.enum(["PENDING", "ACCEPTED", "CANCELLED"]),
  notes: z.string(),
});

export const updatebookingSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  clientId: z.string().min(1),
  timeSlotId: z.string().min(1).nullable(),
  Status: z.enum(["PENDING", "ACCEPTED", "CANCELLED"]),
  notes: z.string(),
});

export const bookingBaseSchema = z.object({
  id: z.string().min(1),
  providerId: z.string(),
  clientId: z.string(),
  provider: userTypeSchema,
  timeSlotId: z.string().nullable(),
  client: userTypeSchema,
  Status: z.enum(["PENDING", "ACCEPTED", "CANCELLED"]),
  notes: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
});
export const bookingWithTimeSlotSchema = bookingBaseSchema.extend({
  timeSlot: timeSlotBaseSchema,
});

export type createBooking = z.infer<typeof createbookingSchema>;
export type updateBooking = z.infer<typeof updatebookingSchema>;
export type bookingType = z.infer<typeof bookingBaseSchema>;

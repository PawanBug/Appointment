import z from "zod";
import { userSchema, userTypeSchema } from "./user-validation";

export const createAvailabilityExceptionSchema = z
  .object({
    userId: z.string(),
    date: z.coerce.date(),
    startTime: z.coerce.number().int().min(0).max(1440).optional(),
    endTime: z.coerce.number().int().min(0).max(1440).optional(),
    reason: z.string(),
  })
  .superRefine((data, ctx) => {
    const { startTime, endTime } = data;

    // If only one is provided → error
    if (
      (startTime !== undefined && endTime === undefined) ||
      (startTime === undefined && endTime !== undefined)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Both startTime and endTime must be provided together",
      });
    }
    if (
      startTime !== undefined &&
      endTime !== undefined &&
      endTime <= startTime
    ) {
      ctx.addIssue({
        code: "custom",
        message: "endTime must be greater than startTime",
        path: ["endTime"],
      });
    }
  });

export const availabilityExceptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: userTypeSchema,
  date: z.date(),
  startTime: z.number().int(),
  endTime: z.number().int(),
  reason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AvailabilityExceptionCreate = z.infer<
  typeof createAvailabilityExceptionSchema
>;

export type AvailabilityException = z.infer<typeof availabilityExceptionSchema>;

import z from "zod";

export const createAvailabilityRuleSchema = z
  .object({
    userId: z.string(),
    dayOfWeek: z.coerce
      .number()
      .int()
      .min(0, "Cannot be negative")
      .max(6, "Cannot be more than 7 days"),
    startTime: z.coerce.number().int().min(0).max(1440),
    endTime: z.coerce.number().int().min(0).max(1440),
    slotSize: z.coerce.number().int().min(30),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Endtime must be greater than start-time.",
    path: ["endTime"],
  });

export const updateAvailabilityRuleSchema = z
  .object({
    dayOfWeek: z.coerce
      .number()
      .int()
      .min(0, "Cannot be negative")
      .max(6, "Cannot be more than 7 days"),
    startTime: z.coerce.number().int().min(0).max(1440),
    endTime: z.coerce.number().int().min(0).max(1440),
    slotSize: z.coerce.number().int().min(30),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "Endtime must be greater than start-time.",
    path: ["endTime"],
  });

import z from "zod";

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

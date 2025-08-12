import { z } from "zod";
import mongoose from "mongoose";

export const applyJobValidation = z.object({
  employeejobId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid Employee Job ID",
    }),
});

export type ApplyJobInput = z.infer<typeof applyJobValidation>;

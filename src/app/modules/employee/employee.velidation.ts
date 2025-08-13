import { z } from "zod";
import mongoose from "mongoose";

const objectId = () =>
  z
    .string("Id is required")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid ObjectId",
    });

const employeeValidationSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string("Description is required")
    .trim()
    .min(1, "Description cannot be empty")
    .max(2000, "Description cannot exceed 2000 characters"),

  requirements: z
    .array(
      z.string().min(1, "Requirement cannot be empty"),
      "Requirements are required"
    )
    .nonempty({ message: "At least one requirement must be provided" }),

  companyName: z
    .string("Company name is required")
    .trim()
    .min(1, "Company name cannot be empty")
    .max(100, "Company name cannot exceed 100 characters"),

  location: z.string().trim().optional(),

  salaryRange: z
    .object({
      min: z.number().min(0, "Salary min cannot be negative").optional(),
      max: z.number().min(0, "Salary max cannot be negative").optional(),
    })
    .optional()
    .refine(
      (val) =>
        !val ||
        val.min === undefined ||
        val.max === undefined ||
        val.min <= val.max,
      {
        message: "Salary min cannot be greater than salary max",
        path: ["min"],
      }
    ),

  jobType: z
    .enum(
      ["full-time", "part-time", "contract", "internship", "remote"],
      "Job type is required"
    )
    .optional()
    .default("full-time"),

  status: z
    .enum(["active", "inactive", "draft"], "Status is required")
    .optional()
    .default("active"),

  applicationDeadline: z.preprocess((arg) => {
    if (!arg) return undefined;
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg as string)
      : undefined;
  }, z.date("Invalid date").optional()),

  user: objectId().optional(),
  applicants: z.array(objectId()).optional(),
});

const employeeValidationSchemaUpdated = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters").optional(),

  description: z
    .string("Description is required")
    .trim()
    .min(1, "Description cannot be empty")
    .max(2000, "Description cannot exceed 2000 characters").optional(),

  requirements: z
    .array(
      z.string().min(1, "Requirement cannot be empty"),
      "Requirements are required"
    )
    .nonempty({ message: "At least one requirement must be provided" }).optional(),

  companyName: z
    .string("Company name is required")
    .trim()
    .min(1, "Company name cannot be empty")
    .max(100, "Company name cannot exceed 100 characters").optional(),

  location: z.string().trim().optional(),

  salaryRange: z
    .object({
      min: z.number().min(0, "Salary min cannot be negative").optional(),
      max: z.number().min(0, "Salary max cannot be negative").optional(),
    })
    .optional()
    .refine(
      (val) =>
        !val ||
        val.min === undefined ||
        val.max === undefined ||
        val.min <= val.max,
      {
        message: "Salary min cannot be greater than salary max",
        path: ["min"],
      }
    ),

  jobType: z
    .enum(
      ["full-time", "part-time", "contract", "internship", "remote"],
      "Job type is required"
    )
    .optional()
    .default("full-time"),

  status: z
    .enum(["active", "inactive"], "Status is required")
    .optional()
    .default("active"),

  applicationDeadline: z.preprocess((arg) => {
    if (!arg) return undefined;
    return typeof arg === "string" || arg instanceof Date
      ? new Date(arg as string)
      : undefined;
  }, z.date("Invalid date").optional()),

  user: objectId().optional(),
  applicants: z.array(objectId()).optional(),
});

export const employeeValidation = {
  employeeValidationSchema,
  employeeValidationSchemaUpdated,
};

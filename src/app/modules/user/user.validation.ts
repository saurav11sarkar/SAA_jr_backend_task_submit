import { z } from "zod";

const employeeSchema = z.object({
  name: z.string("Name is required").trim().min(1, "Name is required"),
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .trim()
    .min(1, "Email is required"),
  password: z.string("Password is required").min(1, "Password is required"),
  role: z
    .enum(["admin", "employee", "jobSeeker"])
    .refine((val) => !!val, {
      message: "Role is required",
    })
    .optional(),
  company: z.string().trim(),
  profilePicture: z.string().optional(),
});

const jobSeekerSchema = z.object({
  name: z.string("Name is required").trim().min(1, "Name is required"),
  email: z
    .string("Email is required")
    .email("Invalid email format")
    .trim()
    .min(1, "Email is required"),
  password: z.string("Password is required").min(1, "Password is required"),
  role: z
    .enum(["admin", "employee", "jobSeeker"])
    .refine((val) => !!val, {
      message: "Role is required",
    })
    .optional(),
  company: z.string().trim().optional(),
});

export const userValidation = {
  employeeSchema,
  jobSeekerSchema,
};

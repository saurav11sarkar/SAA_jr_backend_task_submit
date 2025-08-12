import mongoose, { Schema } from "mongoose";
import { IEmployee } from "./employee.interface";

const employeeSchema = new Schema<IEmployee>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    requirements: {
      type: [String],
      required: [true, "Requirements are required"],
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: "At least one requirement must be provided",
      },
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    applicationDeadline: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobSeeker", 
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

employeeSchema.virtual("applicantCount").get(function () {
  return this.applicants?.length || 0;
});

const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;

import mongoose from "mongoose";
import { IJobSeeker } from "./jobSeeker.interface";

const jobSeekerSchema = new mongoose.Schema<IJobSeeker>(
  {
    employeejobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "employee job id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    cvUrl: {
      type: String,
      required: [true, "cv is reqired"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const JobSeeker = mongoose.model<IJobSeeker>("JobSeeker", jobSeekerSchema);

export default JobSeeker;

import { ObjectId } from "mongoose";

export interface IJobSeeker {
  employeejobId: ObjectId;
  userId: ObjectId;
  cvUrl: String;
  status: "pending" | "accepted" | "rejected";
  invoice?: ObjectId;
  paymentStatus: Boolean;
}

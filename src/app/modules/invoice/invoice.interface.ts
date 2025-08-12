import { ObjectId } from "mongoose";

export interface IInvoice {
  user: ObjectId;
  amount: number;
  description: string;
  status: "pending" | "paid" | "failed";
  paymentDate: Date;
}

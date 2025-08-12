import { ObjectId } from "mongoose";

export interface IEmployee {
  title: string;
  description: string;
  requirements: string[];
  companyName: string;
  location?: string;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  jobType?: "full-time" | "part-time" | "contract" | "internship" | "remote";
  status?: "active" | "inactive" | "draft";
  applicationDeadline?: Date;
  user: ObjectId;
  applicants?: ObjectId[];
  applicantCount?: number;
}

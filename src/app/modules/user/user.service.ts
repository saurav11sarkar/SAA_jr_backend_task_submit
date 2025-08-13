import config from "../../config";
import AppError from "../../error/appError";
import Employee from "../employee/employee.model";
import { Invoice } from "../invoice/invoice.model";
import JobSeeker from "../jobSeeker/jobSeeker.model";
import { IUser } from "./user.interface";
import User from "./user.model";
import bcrypt from "bcryptjs";

const createEemployee = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw new AppError(409, "User already exists");
  const result = await User.create({ ...payload, role: "employee" });
  if (!result) throw new AppError(500, "Something went wrong");
  return result;
};

const createJobSeeker = async (payload: Partial<IUser>) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw new AppError(409, "User already exists");
  const result = await User.create({ ...payload, role: "jobSeeker" });
  if (!result) throw new AppError(500, "Something went wrong");
  return result;
};

const profile = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(404, "User not found");
  return user;
};

const getUserById = async (id: string) => {
  const result = await User.findById(id);
  if (!result) throw new AppError(404, "User not found");
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");
  // Prevent role from being updated
  if ("role" in payload) {
    delete payload.role;
  }

  // If password is being updated, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.round)
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  }).select("-password");

  if (!result) throw new AppError(404, "User not found");

  return result;
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");

  if (user.role === "employee") {
    // Find all jobs by employee
    const jobs = await Employee.find({ user: id });

    // Get job IDs to delete related applicants
    const jobIds = jobs.map((job) => job._id);

    // Delete job seeker applications for these jobs
    await JobSeeker.deleteMany({ employeejobId: { $in: jobIds } });

    // Delete jobs
    await Employee.deleteMany({ user: id });
  }

  if (user.role === "jobSeeker") {
    // Delete all job applications by this user
    const applications = await JobSeeker.find({ userId: id });
    const appIds = applications.map((app) => app._id);

    // Remove this job seeker from applicants arrays in Employee jobs
    await Employee.updateMany(
      { applicants: { $in: appIds } },
      { $pull: { applicants: { $in: appIds } } }
    );

    // Delete job seeker records
    await JobSeeker.deleteMany({ userId: id });
  }

  // Delete invoices for this user
  await Invoice.deleteMany({ user: id });

  // Finally delete the user
  await User.findByIdAndDelete(id);

  return { message: "User and all related data deleted successfully" };
};

export const userService = {
  createEemployee,
  createJobSeeker,
  profile,
  getUserById,
  updateUser,
  deleteUser,
};

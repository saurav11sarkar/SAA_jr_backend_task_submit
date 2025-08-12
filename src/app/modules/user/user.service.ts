import AppError from "../../error/appError";
import { IUser } from "./user.interface";
import User from "./user.model";

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

export const userService = {
  createEemployee,
  createJobSeeker,
  profile,
};

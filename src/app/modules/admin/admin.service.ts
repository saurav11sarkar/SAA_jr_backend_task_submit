import mongoose from "mongoose";
import AppError from "../../error/appError";
import pagination from "../../helper/pagenation";
import pagenation from "../../helper/pagenation";
import { IOption } from "../../interface";
import Employee from "../employee/employee.model";
import JobSeeker from "../jobSeeker/jobSeeker.model";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import { Invoice } from "../invoice/invoice.model";

const adminAllTypeCreateUser = async (payload: Partial<IUser>) => {
  const result = await User.create(payload);
  if (!result) throw new AppError(400, "user is not created");
  return result;
};

const getAllUsers = async (params: any, option: Partial<IOption>) => {
  const { page, limit, skip, sortBy, sortOrder } = pagenation(option);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ["name", "email", "role", "company"];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await User.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .select("-password");

  const total = await User.countDocuments(whereCondition);

  return { data: result, meta: { total, page, limit } };
};

const updatedUser = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(400, "user is not created");
  return result;
};

const deletedUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  if (!result) throw new AppError(400, "user is not created");
  return result;
};

// Employee(recruiters)
const getAllEmployeeJob = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options); // Fixed typo
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    "title",
    "description",
    "requirements",
    "companyName",
    "location",
    "jobType",
    "status",
  ];

  // Search condition
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Filter conditions
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        // Handle salary range filtering
        if (field === "salaryRange") {
          const salary = Number(value);
          return {
            $or: [
              { "salaryRange.min": { $lte: salary } },
              { "salaryRange.max": { $gte: salary } },
              {
                $and: [
                  { "salaryRange.min": { $exists: false } },
                  { "salaryRange.max": { $exists: false } },
                ],
              },
            ],
          };
        }
        // Handle array fields
        if (field === "requirements") {
          return { [field]: { $in: [value] } };
        }
        return { [field]: value };
      }),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const [result, total] = await Promise.all([
    Employee.find(whereCondition)
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit)
      // .populate("user", "name email role")
      // .populate({
      //   path: "applicants",
      //   select: "status cvUrl paymentStatus",
      //   populate: [
      //     { path: "userId", select: "name email" },
      //     { path: "invoice", select: "amount status" },
      //   ],
      // })
      .lean(),
    Employee.countDocuments(whereCondition),
  ]);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleEmployeeJob = async (id: string) => {
  const result = await Employee.findById(id)
    .populate("user", "name email role")
    .populate({
      path: "applicants",
      select: "status cvUrl paymentStatus",
      populate: [
        { path: "userId", select: "name email" },
        { path: "invoice", select: "amount status" },
      ],
    });

  if (!result) {
    throw new AppError(404, "Job not found");
  }
  return result;
};

const updatedEmployeeJob = async (id: string, payload: Partial<IUser>) => {
  const result = await Employee.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(400, "user is not created");
  return result;
};

const deletedEmployeejob = async (id: string) => {
  const job = await Employee.findByIdAndDelete(id);
  if (!job) {
    throw new AppError(404, "Job not found");
  }
  await JobSeeker.deleteMany({ employeejobId: id });
};

// job-seeker

const getAllJobSeeker = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, status, paymentStatus, ...filterData } = params;

  const andCondition: any[] = [];

  // Search condition
  if (searchTerm) {
    andCondition.push({
      $or: [
        { status: { $regex: searchTerm, $options: "i" } },
        {
          $expr: {
            $eq: [
              { $toString: "$paymentStatus" },
              searchTerm.toLowerCase() === "true" ? "true" : "false",
            ],
          },
        },
        { "user.name": { $regex: searchTerm, $options: "i" } },
        { "user.email": { $regex: searchTerm, $options: "i" } },
        { "employee.title": { $regex: searchTerm, $options: "i" } },
        { "employee.companyName": { $regex: searchTerm, $options: "i" } },
      ],
    });
  }

  // Filter conditions
  if (status) {
    andCondition.push({ status });
  }

  if (paymentStatus !== undefined) {
    andCondition.push({ paymentStatus });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const [result, total] = await Promise.all([
    JobSeeker.find(whereCondition)
      .sort({ [sortBy]: sortOrder } as any)
      .skip(skip)
      .limit(limit)
      // .populate("userId", "name email")
      // .populate("employeejobId", "title companyName")
      // .populate("invoice", "amount status")
      .lean(),
    JobSeeker.countDocuments(whereCondition),
  ]);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleJobSeeker = async (id: string) => {
  const result = await JobSeeker.findById(id)
    .populate("userId", "name email")
    .populate("employeejobId", "title companyName")
    .populate("invoice", "amount status");

  if (!result) {
    throw new AppError(404, "Job not found");
  }
  return result;
};

const updatedJobSeeker = async (id: string, payload: Partial<IUser>) => {
  const result = await JobSeeker.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(400, "user is not created");
  return result;
};

const deletedJobSeeker = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find the job seeker application to get related data
    const jobSeeker = await JobSeeker.findById(id).session(session);

    if (!jobSeeker) {
      throw new AppError(404, "Job application not found");
    }

    // 2. Remove the application reference from the employee's applicants array
    await Employee.findByIdAndUpdate(
      jobSeeker.employeejobId,
      { $pull: { applicants: jobSeeker._id } },
      { session }
    );

    // 3. Delete the invoice if exists
    if (jobSeeker.invoice) {
      await Invoice.findByIdAndDelete(jobSeeker.invoice).session(session);
    }

    // 4. Delete the job seeker application
    await JobSeeker.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    return jobSeeker;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// compony analytics

const getAnalytics = async () => {
  const [totalUsers, totalJobs, totalApplications, recentApplications] =
    await Promise.all([
      User.countDocuments(),
      Employee.countDocuments(),
      JobSeeker.countDocuments(),
      JobSeeker.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email")
        .populate("employeejobId", "title companyName"),
    ]);

  const userStats = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const jobStats = await Employee.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const applicationStats = await JobSeeker.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const paymentStats = await JobSeeker.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totals: {
      users: totalUsers,
      jobs: totalJobs,
      applications: totalApplications,
    },
    userStats,
    jobStats,
    applicationStats,
    paymentStats,
    recentApplications,
  };
};

export const adminServices = {
  adminAllTypeCreateUser,
  getAllUsers,
  updatedUser,
  deletedUser,
  getAllEmployeeJob,
  getSingleEmployeeJob,
  updatedEmployeeJob,
  deletedEmployeejob,
  getAllJobSeeker,
  getSingleJobSeeker,
  updatedJobSeeker,
  deletedJobSeeker,
  getAnalytics,
};

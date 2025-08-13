import AppError from "../../error/appError";
import pagination from "../../helper/pagenation";
import { IOption } from "../../interface";
import User from "../user/user.model";
import { IEmployee } from "./employee.interface";
import Employee from "./employee.model";
import JobSeeker from "../jobSeeker/jobSeeker.model";

const createJobEmployee = async (id: string, payload: IEmployee) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  // Validate application deadline if provided
  if (
    payload.applicationDeadline &&
    new Date(payload.applicationDeadline) < new Date()
  ) {
    throw new AppError(400, "Application deadline must be in the future");
  }

  const result = await Employee.create({ ...payload, user: user._id });
  await result.populate("user", "name email role");

  return result;
};

const getEmployeesJob = async (id: string, param: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, status, jobType, ...filterData } = param;

  const andCondition: any[] = [{ user: id }];

  const userSearchableFields = [
    "title",
    "requirements",
    "companyName",
    "description",
    "location",
  ];

  // Search condition
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  // Status filter
  if (status) {
    andCondition.push({ status });
  }

  // Job type filter
  if (jobType) {
    andCondition.push({ jobType });
  }

  // Exact match filters
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = { $and: andCondition };

  const result = await Employee.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  // .populate("user", "name email role")
  // .populate({
  //   path: "applicants",
  //   select: "status cvUrl paymentStatus",
  //   populate: {
  //     path: "userId",
  //     select: "name email"
  //   }
  // });

  const total = await Employee.countDocuments(whereCondition);

  return {
    data: result,
    meta: { total, page, limit },
  };
};

const updatedEmpleoyee = async (
  userId: string,
  id: string,
  payload: Partial<IEmployee>
) => {
  const employee = await Employee.findOne({ _id: id, user: userId });
  if (!employee) {
    throw new AppError(404, "Employee not found or not authorized");
  }

  // Prevent changing certain fields
  const restrictedFields = ["user", "applicants"];
  restrictedFields.forEach((field) => {
    if (payload[field as keyof IEmployee]) {
      throw new AppError(400, `Cannot update ${field} field`);
    }
  });

  const result = await Employee.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deletedEmpleoyee = async (userId: string, id: string) => {
  const employee = await Employee.findOne({ _id: id, user: userId });
  if (!employee) {
    throw new AppError(404, "Employee not found or not authorized");
  }

  const result = await Employee.findByIdAndDelete(id);
  return result;
};

const getEmployeeById = async (userid: string, id: string) => {
  const result = await Employee.findOne({ _id: id, user: userid })
    .populate("user", "name email role")
    .populate({
      path: "applicants",
      select: "status cvUrl paymentStatus",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

  if (!result) {
    throw new AppError(404, "Employee not found or not authorized");
  }
  return result;
};


const updateApplicantStatus = async (
  userId: string,
  employeeJobId: string,
  jobseekerapplicantId: string,
  status: "accepted" | "rejected"
) => {
  // Verify the job belongs to the requesting user
  const job = await Employee.findOne({
    _id: employeeJobId,
    user: userId
  });
  
  if (!job) {
    throw new AppError(403, "You are not authorized to update this job's applicants");
  }

  // Update the applicant status
  const applicant = await JobSeeker.findOneAndUpdate(
    {
      _id: jobseekerapplicantId,
      employeejobId: employeeJobId
    },
    { status },
    { new: true }
  );

  if (!applicant) {
    throw new AppError(404, "Applicant not found for this job");
  }

  return applicant;
};

export const employeeServices = {
  createJobEmployee,
  getEmployeesJob,
  updatedEmpleoyee,
  deletedEmpleoyee,
  getEmployeeById,
  updateApplicantStatus,
};

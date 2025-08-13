import pick from "../../helper/pick";
import catchAsycn from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const adminAllTypeCreateUser = catchAsycn(async (req, res) => {
  const result = await adminServices.adminAllTypeCreateUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsycn(async (req, res) => {
  const filters = pick(req.query, [
    "searchTerm",
    "role",
    "email",
    "name",
    "company",
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updatedUser = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updatedUser(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deletedUser = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deletedUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const getSingleUser = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleUser(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

// Employee(recruiters)
const getAllEmployeeJob = catchAsycn(async (req, res) => {
  console.log("first")
  const filters = pick(req.query, [
    "searchTerm",
    "title",
    "description",
    "requirements",
    "companyName",
    "location",
    "salaryRange",
    "jobType",
    "status",
  ]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await adminServices.getAllEmployeeJob(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Employee job fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleEmployeeJob = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleEmployeeJob(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Employee job fetched successfully",
    data: result,
  });
});
const updatedEmployeeJob = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updatedEmployeeJob(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Employee job updated successfully",
    data: result,
  });
});
const deletedEmployeejob = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deletedEmployeejob(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Employee job deleted successfully",
    data: result,
  });
});

// job-seeker
const getAllJobSeeker = catchAsycn(async (req, res) => {
  const filters = pick(req.query, ["searchTerm", "status", "paymentStatus"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
  // Convert string 'true'/'false' to boolean
  // if (filters.paymentStatus !== undefined) {
  //   filters.paymentStatus = filters.paymentStatus === 'true';
  // }

  const result = await adminServices.getAllJobSeeker(filters, options);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job seekers retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleJobSeeker = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getSingleJobSeeker(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job seeker fetched successfully",
    data: result,
  });
});
const updatedJobSeeker = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updatedJobSeeker(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job seeker updated successfully",
    data: result,
  });
});
const deletedJobSeeker = catchAsycn(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deletedJobSeeker(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job seeker deleted successfully",
    data: result,
  });
});

// compony analytics
const getAnalytics = catchAsycn(async (req, res) => {
  const result = await adminServices.getAnalytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Analytics retrieved successfully",
    data: result,
  });
});

export const adminControllers = {
  adminAllTypeCreateUser,
  getAllUsers,
  updatedUser,
  deletedUser,
  getSingleUser,
  getAllEmployeeJob,
  getAnalytics,
  getSingleEmployeeJob,
  updatedEmployeeJob,
  deletedEmployeejob,
  getAllJobSeeker,
  getSingleJobSeeker,
  updatedJobSeeker,
  deletedJobSeeker,
};

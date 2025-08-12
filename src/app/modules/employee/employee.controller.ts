import { Request, Response } from "express";
import catchAsycn from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import { employeeServices } from "./employee.service";
import pick from "../../helper/pick";

const createJobEmployee = catchAsycn(async (req: Request, res: Response) => {
  const result = await employeeServices.createJobEmployee(
    req.user?.id,
    req.body
  );
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getEmployeesJob = catchAsycn(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "searchTerm",
    "title",
    "requirements",
    "companyName",
    "description",
    "location",
    "status",
    "jobType"
  ]);
  
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
  const result = await employeeServices.getEmployeesJob(
    req.user?.id,
    filters,
    options
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updatedEmpleoyee = catchAsycn(async (req: Request, res: Response) => {
  const result = await employeeServices.updatedEmpleoyee(
    req.user?.id,
    req.params.id,
    req.body
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job updated successfully",
    data: result,
  });
});

const deletedEmpleoyee = catchAsycn(async (req: Request, res: Response) => {
  const result = await employeeServices.deletedEmpleoyee(
    req.user?.id,
    req.params.id
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job deleted successfully",
    data: result,
  });
});

const getEmployeeById = catchAsycn(async (req: Request, res: Response) => {
  const result = await employeeServices.getEmployeeById(
    req.user?.id,
    req.params.id
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job retrieved successfully",
    data: result,
  });
});

const updateApplicantStatus = catchAsycn(async (req: Request, res: Response) => {
  const { jobId, applicantId } = req.params;
  const { status } = req.body;
  
  const result = await employeeServices.updateApplicantStatus(
    req.user?.id,
    jobId,
    applicantId,
    status
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Applicant ${status} successfully`,
    data: result,
  });
});

export const employeeControllers = {
  createJobEmployee,
  getEmployeesJob,
  updatedEmpleoyee,
  deletedEmpleoyee,
  getEmployeeById,
  updateApplicantStatus
};
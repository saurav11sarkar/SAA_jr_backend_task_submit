import { Request, Response } from "express";
import catchAsycn from "../../utils/catchAsycn";
import { jobSeekerService } from "./jobSeeker.service";
import AppError from "../../error/appError";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helper/pick";

const viewJobs = catchAsycn(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "searchTerm",
    "title",
    "requirements",
    "companyName",
    "description",
    "location",
    "jobType",
    "salaryRange"
  ]);
  
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
  const result = await jobSeekerService.viewJobs(filters, options);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const applyJob = catchAsycn(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(400, "CV file is required");
  }

  let formData;
  try {
    formData = req.body.data ? JSON.parse(req.body.data) : req.body;
  } catch (err) {
    throw new AppError(400, "Invalid JSON in 'data' field");
  }

  if (!formData?.employeejobId) {
    throw new AppError(400, "Job ID is required");
  }

  const result = await jobSeekerService.applyJob(
    formData,
    req.file,
    req.user?.id
  );

  res.status(200).json({
    success: true,
    message: "Application submitted successfully",
    data: {
      paymentUrl: result.paymentUrl,
    },
  });
});

const paymentSuccess = catchAsycn(async (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  await jobSeekerService.paymentSuccess(invoiceId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment processed successfully",
  });
});

const paymentFailed = catchAsycn(async (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  await jobSeekerService.paymentFailed(invoiceId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment failed and application was cancelled",
  });
});

const viewApplications = catchAsycn(async (req: Request, res: Response) => {
  const result = await jobSeekerService.viewApplications(req.user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Applications retrieved successfully",
    data: result,
  });
});

export const jobSeekerController = {
  viewJobs,
  applyJob,
  paymentSuccess,
  viewApplications,
  paymentFailed,
};

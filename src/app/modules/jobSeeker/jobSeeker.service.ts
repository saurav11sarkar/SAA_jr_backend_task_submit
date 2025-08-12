import mongoose from "mongoose";
import AppError from "../../error/appError";
import { fileUploader } from "../../helper/fileUploder";
import Employee from "../employee/employee.model";
import { Invoice } from "../invoice/invoice.model";
import { IJobSeeker } from "./jobSeeker.interface";
import JobSeeker from "./jobSeeker.model";
import { paymentService } from "../../helper/PaymentService";
import { IOption } from "../../interface";
import pagination from "../../helper/pagenation";

// jobSeeker.service.ts
const viewJobs = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [{ status: "active" }]; // Only show active jobs
  const userSearchableFields = [
    "title",
    "description",
    "requirements",
    "companyName",
    "location",
    "jobType"
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        // Handle salary range separately
        if (field === 'salaryRange') {
          return {
            $or: [
              { 'salaryRange.min': { $lte: value } },
              { 'salaryRange.max': { $gte: value } }
            ]
          };
        }
        return { [field]: value };
      }),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  
  const result = await Employee.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate("user", "name email")
    .lean();

  const total = await Employee.countDocuments(whereCondition);

  return { 
    data: result, 
    meta: { 
      total, 
      page, 
      limit,
      totalPages: Math.ceil(total / limit)
    } 
  };
};

const applyJob = async (
  payload: IJobSeeker,
  file: Express.Multer.File,
  userId: string
) => {
  const jobExists = await Employee.findById(payload.employeejobId);
  if (!jobExists) throw new AppError(404, "Job not found");

  const alreadyApplied = await JobSeeker.findOne({
    employeejobId: payload.employeejobId,
    userId,
  });
  if (alreadyApplied) throw new AppError(400, "Already applied to this job");

  if (!file) throw new AppError(400, "CV file is required");

  const cvResult = await fileUploader.uploadToCloudinary(file);
  if (!cvResult?.secure_url) throw new AppError(500, "Failed to upload CV");

  const invoice = await Invoice.create({
    user: userId,
    amount: 100,
    description: `Application fee for job: ${jobExists.title}`,
    status: "pending",
  });

  let paymentUrl;
  try {
    const payment = await paymentService.initPayment({
      amount: 100,
      userId,
      invoiceId: invoice._id.toString(),
    });
    paymentUrl = payment.url;
  } catch (error) {
    await Invoice.findByIdAndDelete(invoice._id);
    throw error;
  }

  // ✅ FIX: create job application and store its ID in employee.applicants
  const newApplication = await JobSeeker.create({
    employeejobId: payload.employeejobId,
    userId,
    cvUrl: cvResult.secure_url,
    status: "pending",
    invoice: invoice._id,
    paymentStatus: false,
  });

  await Employee.findByIdAndUpdate(payload.employeejobId, {
    $push: { applicants: newApplication._id }, // ✅ FIXED
  });

  return { paymentUrl };
};

const paymentSuccess = async (invoiceId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        status: "paid",
        paymentDate: new Date(),
      },
      { new: true, session }
    );

    if (!updatedInvoice) {
      throw new AppError(404, "Invoice not found");
    }

    // 2. Update job seeker payment status
    await JobSeeker.findOneAndUpdate(
      { invoice: invoiceId },
      { paymentStatus: true },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const paymentFailed = async (invoiceId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Delete the invoice
    await Invoice.findByIdAndDelete(invoiceId, { session });

    // 2. Find and delete the associated job seeker application
    const jobSeeker = await JobSeeker.findOneAndDelete(
      { invoice: invoiceId },
      { session }
    );

    // 3. Remove the application reference from the employee
    if (jobSeeker?.employeejobId) {
      await Employee.findByIdAndUpdate(
        jobSeeker.employeejobId,
        { $pull: { applicants: jobSeeker._id } },
        { session }
      );
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const viewApplications = async (userId: string) => {
  const resut = await JobSeeker.find({ userId })
    .populate("employeejobId")
    .populate("invoice");
  return resut;
};

export const jobSeekerService = {
  viewJobs,
  applyJob,
  paymentSuccess,
  viewApplications,
  paymentFailed,
};

import catchAsycn from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createEemployee = catchAsycn(async (req, res) => {
  const result = await userService.createEemployee(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Employee created successfully",
    data: result,
  });
});

const createJobSeeker = catchAsycn(async (req, res) => {
  const result = await userService.createJobSeeker(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "JobSeeker created successfully",
    data: result,
  });
});

const profile = catchAsycn(async (req, res) => {
  const result = await userService.profile(req?.user?.email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

export const userController = {
  createEemployee,
  createJobSeeker,
  profile,
};

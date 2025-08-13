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

const getUserById = catchAsycn(async (req, res) => {
  const result = await userService.getUserById(req.user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsycn(async (req, res) => {
  const result = await userService.updateUser(req.user?.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const deleteUser = catchAsycn(async (req, res) => {
  const result = await userService.deleteUser(req.user?.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile deleted successfully",
    data: result,
  });
});

export const userController = {
  createEemployee,
  createJobSeeker,
  profile,
  getUserById,
  updateUser,
  deleteUser,
};

import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import { userValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/employee",
  validationRequest(userValidation.employeeSchema),
  userController.createEemployee
);

router.post(
  "/job-seeker",
  validationRequest(userValidation.jobSeekerSchema),
  userController.createJobSeeker
);

router.get(
  "/profile",
  auth("admin", "jobSeeker", "employee"),
  userController.profile
);

router.get(
  "/",
  auth("admin", "jobSeeker", "employee"),
  userController.getUserById
);
router.put(
  "/",
  auth("admin", "jobSeeker", "employee"),
  userController.updateUser
);
router.delete(
  "/",
  auth("admin", "jobSeeker", "employee"),
  userController.deleteUser
);

export const userRouter = router;

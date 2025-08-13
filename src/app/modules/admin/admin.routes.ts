import express from "express";
import auth from "../../middlewares/auth";
import { adminControllers } from "./admin.controller";
import validationRequest from "../../middlewares/validationRequest";
import { employeeValidation } from "../employee/employee.velidation";
const router = express.Router();

// user
router.post("/", auth("admin"), adminControllers.adminAllTypeCreateUser);
router.get("/", auth("admin"), adminControllers.getAllUsers);

// Employee(recruiters)
router.get("/all-job", auth("admin"), adminControllers.getAllEmployeeJob);

router.get(
  "/all-job/:id",
  auth("admin"),
  adminControllers.getSingleEmployeeJob
);

router.put(
  "/all-job/:id",
  auth("admin"),
  validationRequest(employeeValidation.employeeValidationSchemaUpdated),
  adminControllers.updatedEmployeeJob
);

router.delete(
  "/all-job/:id",
  auth("admin"),
  adminControllers.deletedEmployeejob
);

// Job seeker
router.get("/all-job-seeker", auth("admin"), adminControllers.getAllJobSeeker);
router.get(
  "/all-job-seeker/:id",
  auth("admin"),
  adminControllers.getSingleJobSeeker
);
router.put(
  "/all-job-seeker/:id",
  auth("admin"),
  adminControllers.updatedJobSeeker
);
router.delete(
  "/all-job-seeker/:id",
  auth("admin"),
  adminControllers.deletedJobSeeker
);

// Analytics route
router.get("/analytics", auth("admin"), adminControllers.getAnalytics);

// user router
router.put("/:id", auth("admin"), adminControllers.updatedUser);
router.delete("/:id", auth("admin"), adminControllers.deletedUser);
router.get("/:id", auth("admin"), adminControllers.getSingleUser);

export const adminRouter = router;

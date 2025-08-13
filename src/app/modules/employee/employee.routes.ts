import express from "express";
import auth from "../../middlewares/auth";
import { employeeControllers } from "./employee.controller";
import validationRequest from "../../middlewares/validationRequest";
import { employeeValidation } from "./employee.velidation";
import z from "zod";

const router = express.Router();

// Job posting routes
router.post(
  "/create-job",
  auth("employee"),
  validationRequest(employeeValidation.employeeValidationSchema),
  employeeControllers.createJobEmployee
);

router.get(
  "/",
  auth("employee"),
  employeeControllers.getEmployeesJob
);

router.put(
  "/:id",
  auth("employee"),
  validationRequest(employeeValidation.employeeValidationSchema.partial()),
  employeeControllers.updatedEmpleoyee
);

router.delete(
  "/:id",
  auth("employee"),
  employeeControllers.deletedEmpleoyee
);

router.get(
  "/:id",
  auth("employee"),
  employeeControllers.getEmployeeById
);

// Applicant management routes
router.patch(
  "/:employeeJobId/applicants/:jobseekerapplicantId",
  auth("employee"),
  validationRequest(z.object({
    status: z.enum(["accepted", "rejected"])
  })),
  employeeControllers.updateApplicantStatus
);

export const employeeRouter = router;
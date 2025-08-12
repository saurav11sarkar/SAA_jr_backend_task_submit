import express from "express";
import { jobSeekerController } from "./jobSeeker.controller";

import auth from "../../middlewares/auth";
import { fileUploader } from "../../helper/fileUploder";

const router = express.Router();

router.get("/jobs", jobSeekerController.viewJobs);

router.post(
  "/apply",
  auth("jobSeeker"),
  fileUploader.upload.single("cv"),
  jobSeekerController.applyJob
);

router.get(
  "/applications",
  auth("jobSeeker"),
  jobSeekerController.viewApplications
);

router.get("/payment/success/:invoiceId", jobSeekerController.paymentSuccess);

router.get(
  "/payment/fail/:invoiceId",
  jobSeekerController.paymentFailed
);

export const jobSeekerRouter = router;

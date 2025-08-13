import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import { authController } from "./auth.controller";
import { authSchemaValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/login",
  validationRequest(authSchemaValidation),
  authController.loginUser
);

router.post("/refresh-token", authController.refreshToken);

export const authRouter = router;

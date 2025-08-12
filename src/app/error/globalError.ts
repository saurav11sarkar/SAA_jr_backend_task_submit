import { NextFunction, Request, Response } from "express";
import config from "../config";

const globalError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: config.env === "development" ? err.stack : "",
    error: err,
  });
};

export default globalError;

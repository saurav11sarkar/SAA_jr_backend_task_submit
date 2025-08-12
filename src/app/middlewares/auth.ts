import { NextFunction, Request, Response } from "express";
import AppError from "../error/appError";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../config";
import { JwtPayload, Secret } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(401, "Unauthorized token");
      }
      const decodeToken = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_access_scret as Secret
      );
      if (!decodeToken) {
        throw new AppError(401, "Unauthorized decode");
      }

      if (role.length && !role.includes(decodeToken.role)) {
        throw new AppError(401, "Unauthorized role");
      }
      req.user = decodeToken as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

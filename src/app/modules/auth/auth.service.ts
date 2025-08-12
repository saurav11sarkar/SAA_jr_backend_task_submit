import { Secret } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../error/appError";
import { jwtHelper } from "../../helper/jwtHelper";
import User from "../user/user.model";
import bcrypt from "bcryptjs";

const loginUser = async (payload: { email: string; password: string }) => {
  if (!payload.email && !payload.password) {
    throw new AppError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) throw new AppError(404, "User not found");
  const isMatched = await bcrypt.compare(payload.password, user.password);
  if (!isMatched) throw new AppError(401, "Password is incorrect");

  const accessToken = jwtHelper.generatToken(
    {id: user._id.toString(), email: user.email, role: user.role },
    config.jwt.jwt_access_scret as Secret,
    config.jwt.jwt_access_expire
  );

  const refreshToken = jwtHelper.generatToken(
    {id: user._id.toString(), email: user.email, role: user.role },
    config.jwt.jwt_refresh_scret as Secret,
    config.jwt.jwt_refresh_expire
  );

  const { password: _, ...userWithoutPassword } = user.toObject();

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwtHelper.verifyToken(
    refreshToken,
    config.jwt.jwt_refresh_scret as Secret
  );

  const user = await User.findOne({ email: decoded.email });

  if (!user) throw new AppError(404, "User not found");

  const accessToken = jwtHelper.generatToken(
    { id: user._id.toString(), email: user.email, role: user.role },
    config.jwt.jwt_access_scret as Secret,
    config.jwt.jwt_access_expire
  );

  return { accessToken };
};

export const authServices = {
  loginUser,
  refreshToken,
};

/* eslint-disable  no-unsafe-optional-chaining */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { createToken, isPasswordValid, verifyToken } from "./auth.utils";
import { TUser } from "../user/user.interface";
import config from "../../config";
import { getExistingUserByEmail } from "../user/user.utils";
import { User } from "../user/user.model";

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  const existingUser = await getExistingUserByEmail(email);

  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!(await isPasswordValid(password, existingUser?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect");
  }

  const jwtPayload = {
    userId: (existingUser?._id).toString(),
    role: existingUser?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  (existingUser as Partial<TUser>).password = undefined;

  return { accessToken, refreshToken, existingUser };
};

const refreshToken = async (refreshToken: string) => {
  // check if the refresh token in valid
  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string
  );

  const { userId } = decoded;

  // checking if the user exists
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtPayload = { userId: existingUser?.id, role: existingUser?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

export const AuthService = {
  loginUser,
  refreshToken,
};

/* eslint-disable  no-unsafe-optional-chaining */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import { createToken, isPasswordValid, verifyToken } from "./auth.utils";
import { TUser } from "../user/user.interface";
import config from "../../config";
import { encryptPassword, getExistingUserByEmail } from "../user/user.utils";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { sendResetPasswordEmail } from "../../utils/sendEmail";

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
    email: existingUser?.email,
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

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { email } = userData;

  const existingUser = await getExistingUserByEmail(email);

  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!(await isPasswordValid(payload.oldPassword, existingUser?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect");
  }

  const newHashedPassword = await encryptPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    }
  );

  return null;
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
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const jwtPayload = { userId: existingUser?.id, role: existingUser?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const forgotPassword = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const jwtPayload = { userId: existingUser?.id, role: existingUser?.role };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUILink = `${config.client_url}?id=${existingUser.id}&token=${resetToken}`;

  // eslint-disable-next-line no-console
  console.log(`Sending Email to: ${existingUser?.email}`);
  sendResetPasswordEmail(existingUser?.email, resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const existingUser = await User.findById(payload.id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const decoded = verifyToken(token, config.jwt_access_secret as string);

  const { userId, role } = decoded;

  if (payload?.id !== userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const newHashedPassword = await encryptPassword(payload.newPassword);

  await User.findOneAndUpdate(
    {
      _id: userId,
      role,
    },
    {
      password: newHashedPassword,
    }
  );
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};

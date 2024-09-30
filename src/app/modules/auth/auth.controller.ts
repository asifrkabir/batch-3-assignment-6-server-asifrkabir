import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken, accessToken, existingUser } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production", // https in prod, http in dev
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: accessToken,
    data: existingUser,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved successfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};

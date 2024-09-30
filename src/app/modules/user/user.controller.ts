import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status";

// const createUser = catchAsync(async (req, res) => {
//   const result = await UserService.createUser(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "User registered successfully",
//     data: result,
//   });
// });

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
};

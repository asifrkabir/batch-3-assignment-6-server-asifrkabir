import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FollowService } from "./follow.service";

const follow = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { toBeFollowedUserId } = req.params;

  const result = await FollowService.follow(userId, toBeFollowedUserId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

const unfollow = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { toBeUnfollowedUserId } = req.params;

  const result = await FollowService.unfollow(userId, toBeUnfollowedUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unfollowed successfully",
    data: result,
  });
});

export const FollowController = {
  follow,
  unfollow,
};

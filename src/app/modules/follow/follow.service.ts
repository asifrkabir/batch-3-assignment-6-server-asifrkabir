import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { Follow } from "./follow.model";
import { TFollow } from "./follow.interface";

const follow = async (followerId: string, toBeFollowedUserId: string) => {
  const follower = await getExistingUserById(followerId);

  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, "Follower not found");
  }

  const toBeFollowed = await getExistingUserById(toBeFollowedUserId);

  if (!toBeFollowed) {
    throw new AppError(httpStatus.NOT_FOUND, "User to be followed not found");
  }

  if (follower._id.equals(toBeFollowed._id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "User cannot follow themselves");
  }

  const existingFollow = await Follow.findOne({
    follower: follower,
    following: toBeFollowed,
  });

  if (existingFollow) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already following this user"
    );
  }

  const payload: TFollow = {
    follower: follower._id,
    following: toBeFollowed._id,
  };

  const result = await Follow.create(payload);

  return result;
};

export const FollowService = {
  follow,
};

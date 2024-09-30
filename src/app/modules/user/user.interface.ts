import { Types } from "mongoose";
import { USER_ROLE_ENUM } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  profilePicture: string;
  bio: string;
  followers: [Types.ObjectId];
  following: [Types.ObjectId];
  // posts: [Types.ObjectId];
  // purchasedPosts: [Types.ObjectId];
};

export type TUserRole = keyof typeof USER_ROLE_ENUM;

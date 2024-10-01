import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { encryptPassword, getExistingUserById } from "./user.utils";
import { USER_ROLE_ENUM, userSearchableFields } from "./user.constant";
import { TImageFiles } from "../../interface/image.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const getUserById = async (id: string) => {
  const result = await User.findById(id).select("-password");

  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createUser = async (payload: TUser, images: TImageFiles) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email. Please use a different email address"
    );
  }

  const { itemImages } = images;

  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  }

  payload.password = await encryptPassword(payload.password);
  payload.role = USER_ROLE_ENUM.user;

  const result = await User.create(payload);

  (result as Partial<TUser>).password = undefined;

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<TUser>,
  images: TImageFiles
) => {
  const existingUser = await getExistingUserById(id);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const { itemImages } = images;

  // New Profile Picture
  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  } else if (payload.profilePicture === null) {
    // Remove Profile Picture
    payload.profilePicture = "";
  }

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  (result as Partial<TUser>).password = undefined;

  return result;
};

export const UserService = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
};

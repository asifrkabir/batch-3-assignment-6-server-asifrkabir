import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { encryptPassword, getExistingUserById } from "./user.utils";
import { USER_ROLE_ENUM } from "./user.constant";
import { TImageFiles } from "../../interface/image.interface";

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

  if (itemImages && itemImages.length > 0) {
    payload.profilePicture = itemImages[0]?.path;
  }

  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  (result as Partial<TUser>).password = undefined;

  return result;
};

export const UserService = {
  createUser,
  updateUser,
};

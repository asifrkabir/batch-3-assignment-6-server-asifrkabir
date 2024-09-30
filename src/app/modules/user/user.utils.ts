import config from "../../config";
import bcrypt from "bcrypt";
import { User } from "./user.model";

export const encryptPassword = async (plainTextPassword: string) => {
  const encryptedPassword = await bcrypt.hash(
    plainTextPassword,
    Number(config.bcrypt_salt_rounds)
  );

  return encryptedPassword;
};

export const getExistingUserByEmail = async (email: string) => {
  const result = await User.findOne({ email }).select([
    "+password",
    "-__v",
    "-createdAt",
    "-updatedAt",
  ]);

  return result;
};

export const getExistingUserById = async (id: string) => {
  const result = await User.findById(id).select(["+password"]);

  return result;
};

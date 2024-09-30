import { USER_ROLE_ENUM } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: "admin" | "user";
};

export type TUserRole = keyof typeof USER_ROLE_ENUM;

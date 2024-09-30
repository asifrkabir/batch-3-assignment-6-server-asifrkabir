import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { UserValidations } from "../user/user.validation";
import { UserController } from "../user/user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.post(
  "/register",
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE_ENUM.user, USER_ROLE_ENUM.admin),
  // validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post(
  "/forgot-password",
  // validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  // validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;

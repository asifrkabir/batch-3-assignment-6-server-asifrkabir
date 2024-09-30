import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthController } from "./auth.controller";
import { UserValidations } from "../user/user.validation";
import { UserController } from "../user/user.controller";

const router = Router();

router.post(
  "/signup",
  validateRequest(UserValidations.createUserValidationSchema),
  UserController.createUser
);

router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;

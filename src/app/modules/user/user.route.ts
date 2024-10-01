import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.put(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  multerUpload.fields([{ name: "itemImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(UserValidations.updateUserValidationSchema),
  UserController.updateUser
);

export const UserRoutes = router;

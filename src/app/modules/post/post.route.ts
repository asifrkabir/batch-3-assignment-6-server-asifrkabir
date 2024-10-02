import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middlewares/validateImageFileRequest";
import { ImageFilesArrayZodSchema } from "../../zod/image.validation";
import { parseBody } from "../../middlewares/bodyParser";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidations } from "./post.validation";
import { PostController } from "./post.controller";
import { USER_ROLE_ENUM } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = Router();

router.get(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getPostById
);

router.get(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  PostController.getAllPosts
);

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  multerUpload.fields([{ name: "postImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidations.createPostValidationSchema),
  PostController.createPost
);

router.put(
  "/:id",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  multerUpload.fields([{ name: "postImages" }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  validateRequest(PostValidations.updatePostValidationSchema),
  PostController.updatePost
);

export const PostRoutes = router;

import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { CommentController } from "./comment.controller";
import { CommentValidations } from "./comment.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  validateRequest(CommentValidations.createCommentValidationSchema),
  CommentController.createComment
);

export const CommentRoutes = router;

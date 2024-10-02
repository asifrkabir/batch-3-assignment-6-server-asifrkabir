import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";
import { FollowController } from "./follow.controller";

const router = Router();

router.post(
  "/:toBeFollowedUserId",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  FollowController.follow
);

export const FollowRoutes = router;

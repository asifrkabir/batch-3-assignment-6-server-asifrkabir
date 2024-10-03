import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { getExistingUserById } from "../user/user.utils";
import { TComment } from "./comment.interface";
import { getExistingPostById } from "../post/post.utils";
import { Comment } from "./comment.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { commentSearchableFields } from "./comment.constant";

const getAllComments = async (query: Record<string, unknown>) => {
  const commentQuery = new QueryBuilder(Comment.find(), query)
    .search(commentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await commentQuery.modelQuery;
  const meta = await commentQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createComment = async (userId: string, payload: TComment) => {
  const { post } = payload;

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingPost = await getExistingPostById(post.toString());

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  payload.user = existingUser._id;

  const result = await Comment.create(payload);

  return result;
};

export const CommentService = {
  createComment,
  getAllComments,
};

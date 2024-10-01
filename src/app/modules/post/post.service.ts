import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import { getExistingPostById } from "./post.utils";
import { getExistingUserById } from "../user/user.utils";

const createPost = async (payload: TPost, images: TImageFiles) => {
  const { postImages } = images;

  if (postImages && postImages.length > 0) {
    payload.imageUrls = postImages.map((image) => image.path);
  }

  payload.upvotes = 0;
  payload.downvotes = 0;

  const result = await Post.create(payload);

  return result;
};

const updatePost = async (
  postId: string,
  userId: string,
  payload: Partial<TPost>,
  images: TImageFiles
) => {
  const existingPost = await getExistingPostById(postId);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const existingUser = await getExistingUserById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!existingPost.author.equals(existingUser._id)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this post"
    );
  }

  let existingImageUrls: string[] = [];
  let newImageUrls: string[] = [];

  if (payload.imageUrls && payload.imageUrls.length > 0) {
    existingImageUrls = payload.imageUrls;
  }

  const { postImages } = images;

  if (postImages && postImages.length > 0) {
    newImageUrls = postImages.map((image) => image.path);
  }

  const finalImageUrls = [...existingImageUrls, ...newImageUrls];
  payload.imageUrls = finalImageUrls;

  const result = await Post.findOneAndUpdate({ _id: postId }, payload, {
    new: true,
  });

  return result;
};

export const PostService = {
  createPost,
  updatePost,
};

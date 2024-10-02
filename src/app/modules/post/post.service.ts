import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./post.interface";
import { Post } from "./post.model";
import { getExistingPostById } from "./post.utils";
import { getExistingUserById } from "../user/user.utils";
import QueryBuilder from "../../builder/QueryBuilder";
import { postSearchableFields } from "./post.constant";

const getPostById = async (id: string) => {
  const result = await Post.findOne({ _id: id, isActive: true });

  return result;
};

const getAllPosts = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Post.find({ isActive: true }), query)
    .search(postSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    result,
  };
};

const createPost = async (
  authorId: string,
  payload: TPost,
  images: TImageFiles
) => {
  const existingAuthor = await getExistingUserById(authorId);

  if (!existingAuthor) {
    throw new AppError(httpStatus.NOT_FOUND, "Author not found");
  }

  payload.author = existingAuthor._id;

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

const deletePost = async (id: string) => {
  const existingPost = await getExistingPostById(id);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  return result;
};

const togglePostPublish = async (id: string, payload: Partial<TPost>) => {
  const existingPost = await getExistingPostById(id);

  if (!existingPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const isPublished = payload.isPublished;

  const newPublishStatus =
    isPublished !== undefined ? isPublished : !existingPost.isPublished;

  const result = await Post.findByIdAndUpdate(
    id,
    { isPublished: newPublishStatus },
    { new: true }
  );

  return result;
};

export const PostService = {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
};

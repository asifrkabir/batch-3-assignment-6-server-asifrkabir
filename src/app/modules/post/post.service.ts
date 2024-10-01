import { TImageFiles } from "../../interface/image.interface";
import { TPost } from "./post.interface";
import { Post } from "./post.model";

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

export const PostService = {
  createPost,
};

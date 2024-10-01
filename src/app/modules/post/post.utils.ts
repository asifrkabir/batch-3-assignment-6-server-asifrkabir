import { Post } from "./post.model";

export const getExistingPostById = async (id: string) => {
  const result = await Post.findById(id);

  return result;
};

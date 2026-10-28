import api from "@/service/api";
import { PostsResponse, LikedPostsResponse } from "@/service/types";

interface GetPostsParams {
  skip?: number;
  limit?: number;
  userId?: number;
}

interface GetLikedPostsParams {
  userId: number;
  limit?: number;
}

interface LikePostParams {
  postId: number;
  userId: number;
}

async function getPosts(params: GetPostsParams): Promise<PostsResponse> {
  const { limit = 10, skip = 0, userId } = params;
  const response = await api.get<PostsResponse>("/posts", {
    params: { limit, skip, userId },
  });
  return response.data;
}

async function getLikedPosts(
  params: GetLikedPostsParams
): Promise<LikedPostsResponse> {
  const { userId, limit = 10 } = params;
  const response = await api.get<LikedPostsResponse>("/posts/liked", {
    params: { userId, limit },
  });
  return response.data;
}

async function toggleLikePost(params: LikePostParams): Promise<void> {
  const { postId, userId } = params;
  await api.post(`/posts/${postId}/like`, null, {
    params: { userId },
  });
}

export const postsService = {
  getPosts,
  getLikedPosts,
  toggleLikePost,
};

import { Post, Comment } from '../../../types';

interface RawComment {
  id: { timestamp: string };
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface RawPost {
  id: { timestamp: string };
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  comments: RawComment[];
}

const normalizePost = (post: RawPost): Post => {
  const normalizedComments: Comment[] = (post.comments || []).map(
    (comment: RawComment): Comment => ({
      id: comment.id.timestamp,
      postId: comment.postId,
      author: comment.author,
      content: comment.content,
      createdAt: new Date(comment.createdAt).toISOString(),
      updatedAt: comment.updatedAt ? new Date(comment.updatedAt).toISOString() : undefined
    })
  );

  return {
    _id: post.id.timestamp,
    userId: post.userId,
    title: post.title,
    content: post.content,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    comments: normalizedComments
  };
};

export default normalizePost;

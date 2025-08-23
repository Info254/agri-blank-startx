import { useEffect, useState } from 'react';
import { listComments, deleteComment } from '../services/forumCommentService';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
}

interface ForumCommentListProps {
  postId: string;
  userId: string;
}

export default function ForumCommentList({ postId, userId }: ForumCommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await listComments(postId);
      if (error) setError(error.message);
      else setComments(data || []);
    } catch (err) {
      setError('Failed to load comments');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleDelete = async (id: string) => {
    await deleteComment(id);
    fetchComments();
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!comments.length) return <div>No comments yet.</div>;

  return (
    <ul className="divide-y mt-2">
      {comments.map(comment => (
        <li key={comment.id} className="py-2">
          <div className="text-sm">{comment.content}</div>
          <div className="text-xs text-gray-500">{comment.createdAt}</div>
          {userId === comment.userId && (
            <button className="text-xs text-red-500 ml-2" onClick={() => handleDelete(comment.id)}>Delete</button>
          )}
        </li>
      ))}
    </ul>
  );
}

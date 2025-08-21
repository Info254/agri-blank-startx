import React, { useState } from 'react';
import { createComment } from '../services/forumCommentService';

export default function ForumCommentForm({ postId, userId, onCommented }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await createComment({ postId, userId, content, createdAt: new Date().toISOString() });
      if (error) setError(error.message);
      else {
        setContent('');
        if (onCommented) onCommented();
      }
    } catch (err) {
      setError('Failed to post comment');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="textarea textarea-bordered w-full"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading || !content.trim()}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

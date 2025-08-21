import React, { useEffect, useState } from 'react';
import ForumCommentForm from './ForumCommentForm';
import ForumCommentList from './ForumCommentList';
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  listPosts
} from '../services/carbonForumService';

export const CarbonForumPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: '', event_date: '', org_link: '', success_story: '' });
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    listPosts().then(({ data }) => setPosts(data || []));
  }, []);

  const handleCreatePost = async () => {
    await createPost({ ...newPost, user_id: userId });
    listPosts().then(({ data }) => setPosts(data || []));
    setNewPost({ title: '', content: '', type: '', event_date: '', org_link: '', success_story: '' });
  };

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
    setEditMode(false);
  };

  const handleUpdatePost = async () => {
    if (selectedPost) {
      await updatePost(selectedPost.id, selectedPost);
      listPosts().then(({ data }) => setPosts(data || []));
      setEditMode(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    listPosts().then(({ data }) => setPosts(data || []));
    setSelectedPost(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Carbon Credit & Circular Economy Forum</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Create New Post</h3>
        <input type="text" placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
        <textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
        <input type="text" placeholder="Type (event, opportunity, story)" value={newPost.type} onChange={e => setNewPost({ ...newPost, type: e.target.value })} />
        <input type="date" placeholder="Event Date" value={newPost.event_date} onChange={e => setNewPost({ ...newPost, event_date: e.target.value })} />
        <input type="text" placeholder="Organization Link" value={newPost.org_link} onChange={e => setNewPost({ ...newPost, org_link: e.target.value })} />
        <input type="text" placeholder="Success Story" value={newPost.success_story} onChange={e => setNewPost({ ...newPost, success_story: e.target.value })} />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Forum Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <button onClick={() => handleSelectPost(post)}>{post.title} ({post.type})</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedPost && (
        <div className="mb-4">
          <h3 className="font-semibold">Post Details</h3>
          {editMode ? (
            <div>
              <input type="text" value={selectedPost.title} onChange={e => setSelectedPost({ ...selectedPost, title: e.target.value })} />
              <textarea value={selectedPost.content} onChange={e => setSelectedPost({ ...selectedPost, content: e.target.value })} />
              <button onClick={handleUpdatePost}>Save</button>
            </div>
          ) : (
            <div>
              <h4>{selectedPost.title}</h4>
              <p>{selectedPost.content}</p>
              <button onClick={() => setEditMode(true)}>Edit</button>
            </div>
          )}
          {/* Forum Comments Section */}
          <div className="mt-4">
            <h4 className="font-semibold">Comments</h4>
            <ForumCommentForm postId={selectedPost.id} userId={userId} onCommented={() => {}} />
            <ForumCommentList postId={selectedPost.id} userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

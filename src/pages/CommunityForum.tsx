import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, MessageSquare, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreatePostForm from '@/components/community/CreatePostForm';
import PostCard from '@/components/community/PostCard';
import CommunityFilters from '@/components/community/CommunityFilters';

const CommunityForum: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchPosts();
  }, [category, sortBy]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            is_verified
          ),
          community_polls (
            id,
            question,
            options,
            total_votes
          )
        `)
        .eq('is_active', true);

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      switch (sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'commented':
          query = query.order('comments_count', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: post, error: postError } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          location: postData.location,
          tags: postData.tags
        })
        .select()
        .single();

      if (postError) throw postError;

      // Create poll if included
      if (postData.poll && post) {
        const pollOptions = postData.poll.options.map((option: string, index: number) => ({
          text: option,
          votes: 0
        }));

        const { error: pollError } = await supabase
          .from('community_polls')
          .insert({
            post_id: post.id,
            user_id: user.id,
            question: postData.poll.question,
            options: pollOptions
          });

        if (pollError) throw pollError;
      }

      toast({
        title: "Success",
        description: "Your post has been created successfully!"
      });

      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post => 
    searchTerm === '' || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Community Forum</h1>
          <p className="text-muted-foreground">Connect with fellow farmers and agricultural experts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Active Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-sm text-muted-foreground">Posts this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Community Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,500+</div>
              <p className="text-sm text-muted-foreground">Active farmers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Popular Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div>#maize-farming</div>
                <div>#weather-alerts</div>
                <div>#market-prices</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCreateForm(true)} 
                className="w-full"
                disabled={!user}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CardContent>
          </Card>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreatePostForm
              onSubmit={createPost}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        <CommunityFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to start a discussion!'}
                </p>
                {!showCreateForm && user && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  author: {
                    name: post.profiles?.full_name || 'Anonymous',
                    avatar: post.profiles?.avatar_url,
                    isVerified: post.profiles?.is_verified
                  },
                  category: post.category,
                  tags: post.tags || [],
                  location: post.location,
                  likes: post.likes_count || 0,
                  comments: post.comments_count || 0,
                  createdAt: post.created_at,
                  poll: post.community_polls?.[0] ? {
                    id: post.community_polls[0].id,
                    question: post.community_polls[0].question,
                    options: post.community_polls[0].options || [],
                    totalVotes: post.community_polls[0].total_votes || 0
                  } : undefined
                }}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityForum;

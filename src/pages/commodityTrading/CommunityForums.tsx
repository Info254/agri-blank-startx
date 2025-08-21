
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CommunityPost } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, MessageSquare, ThumbsUp, User, Calendar, Clock, MapPin, Filter } from 'lucide-react';

const CommunityForums: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [postDetailDialog, setPostDetailDialog] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      // Simulating API call
      setTimeout(() => {
        const mockPosts: CommunityPost[] = [
          {
            id: '1',
            title: 'Best practices for tomato farming in dry regions',
            content: 'I\'ve been farming tomatoes for 5 years in Machakos county and I\'ve found that drip irrigation with mulching works best to conserve water. Has anyone tried different varieties that are more drought resistant?',
            author: 'John Kamau',
            date: '2023-05-10',
            likes: 24,
            comments: 8,
            category: 'farming',
            tags: ['tomatoes', 'drought', 'irrigation'],
            userName: 'John Kamau',
            created: '2023-05-10',
            userId: 'user123'
          },
          {
            id: '2',
            title: 'Market prices for maize in Western Kenya',
            content: 'The maize prices in Kakamega and surrounding areas have been fluctuating a lot recently. I\'ve noticed buyers offering between 2800-3500 KES per bag. Are others experiencing the same? What are you being offered in your areas?',
            author: 'Grace Wanjiku',
            date: '2023-05-15',
            likes: 18,
            comments: 12,
            category: 'markets',
            tags: ['maize', 'prices', 'western-kenya'],
            location: 'Kakamega',
            userName: 'Grace Wanjiku',
            created: '2023-05-15',
            userId: 'user456'
          },
          {
            id: '3',
            title: 'Cooperative forming in Meru for coffee farmers',
            content: 'We are forming a new cooperative for small-scale coffee farmers in Meru county. The goal is to improve our bargaining power with buyers and share resources for processing. If you\'re a coffee farmer in the region and interested in joining, please comment below.',
            author: 'Daniel Mutua',
            date: '2023-05-20',
            likes: 32,
            comments: 15,
            category: 'cooperatives',
            tags: ['coffee', 'cooperative', 'meru'],
            location: 'Meru',
            userName: 'Daniel Mutua',
            created: '2023-05-20',
            userId: 'user789'
          },
          {
            id: '4',
            title: 'Pest control solutions for french beans',
            content: 'I\'m having issues with whiteflies on my french beans crop. They\'re affecting the quality and I\'m worried about meeting export standards. Has anyone found effective organic solutions that don\'t leave residues?',
            author: 'Sarah Odhiambo',
            date: '2023-05-25',
            likes: 15,
            comments: 7,
            category: 'pest-control',
            tags: ['french-beans', 'pests', 'organic'],
            location: 'Kirinyaga',
            userName: 'Sarah Odhiambo',
            created: '2023-05-25',
            userId: 'user101'
          },
        ];
        setPosts(mockPosts);
      }, 1000);
    };
    
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        title: newPostTitle,
        content: newPostContent,
        author: "Current User", // In a real app, get from auth context
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        category: newPostCategory,
        tags: [],
        userName: "Current User",
        created: new Date().toISOString(),
        userId: "currentUser123"
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      setNewPostDialog(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostCategory('general');
      setIsSubmitting(false);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    }, 1500);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery 
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Community Forums</h1>
            <p className="text-muted-foreground">Connect with other farmers, share knowledge, ask questions</p>
          </div>
          <Button onClick={() => setNewPostDialog(true)}>Create New Post</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="py-4">
                <h3 className="font-semibold">Categories</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Button 
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </Button>
                  <Button 
                    variant={selectedCategory === 'farming' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('farming')}
                  >
                    Farming Practices
                  </Button>
                  <Button 
                    variant={selectedCategory === 'markets' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('markets')}
                  >
                    Markets & Prices
                  </Button>
                  <Button 
                    variant={selectedCategory === 'cooperatives' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('cooperatives')}
                  >
                    Cooperatives
                  </Button>
                  <Button 
                    variant={selectedCategory === 'pest-control' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('pest-control')}
                  >
                    Pest & Disease Control
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <h3 className="font-semibold">Popular Tags</h3>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">maize</Badge>
                  <Badge variant="outline">coffee</Badge>
                  <Badge variant="outline">tomatoes</Badge>
                  <Badge variant="outline">irrigation</Badge>
                  <Badge variant="outline">prices</Badge>
                  <Badge variant="outline">pests</Badge>
                  <Badge variant="outline">fertilizer</Badge>
                  <Badge variant="outline">drought</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <Input 
                  placeholder="Search posts..." 
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="recent" className="w-full">
                <TabsList>
                  <TabsTrigger value="recent">Recent Posts</TabsTrigger>
                  <TabsTrigger value="popular">Most Popular</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-4 mt-4">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">No posts found</h3>
                      <p className="text-muted-foreground mt-1">
                        Be the first to start a discussion on this topic
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <Card key={post.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => {
                        setSelectedPost(post);
                        setPostDetailDialog(true);
                      }}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5 mr-1">
                                  <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{post.userName}</span>
                                <span className="mx-1">•</span>
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{new Date(post.created).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="line-clamp-2 text-sm">{post.content}</p>
                          {post.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-4">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="popular" className="space-y-4 mt-4">
                  {filteredPosts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 5)
                    .map((post) => (
                      <Card key={post.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => {
                        setSelectedPost(post);
                        setPostDetailDialog(true);
                      }}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5 mr-1">
                                  <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{post.userName}</span>
                                <span className="mx-1">•</span>
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{new Date(post.created).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="line-clamp-2 text-sm">{post.content}</p>
                          {post.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-4">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                        </CardFooter>
                      </Card>
                    ))}
                </TabsContent>
                
                <TabsContent value="unanswered" className="space-y-4 mt-4">
                  {filteredPosts
                    .filter(post => post.comments === 0)
                    .map((post) => (
                      <Card key={post.id} className="cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => {
                        setSelectedPost(post);
                        setPostDetailDialog(true);
                      }}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{post.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Avatar className="h-5 w-5 mr-1">
                                  <AvatarFallback>{post.userName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{post.userName}</span>
                                <span className="mx-1">•</span>
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>{new Date(post.created).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="line-clamp-2 text-sm">{post.content}</p>
                          {post.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{post.location}</span>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-4">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                        </CardFooter>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your knowledge, ask questions, or discuss topics with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="farming">Farming Practices</SelectItem>
                  <SelectItem value="markets">Markets & Prices</SelectItem>
                  <SelectItem value="cooperatives">Cooperatives</SelectItem>
                  <SelectItem value="pest-control">Pest & Disease Control</SelectItem>
                  <SelectItem value="equipment">Equipment & Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Input 
                id="title" 
                placeholder="Post title" 
                className="col-span-4" 
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Textarea 
                placeholder="Share your thoughts, questions, or knowledge here..." 
                className="col-span-4" 
                rows={6}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} onClick={handleCreatePost}>
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Post Detail Dialog */}
      <Dialog open={postDetailDialog} onOpenChange={setPostDetailDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <Badge variant="outline" className="mb-2">{selectedPost.category}</Badge>
                    <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{selectedPost.author[0]}</AvatarFallback>
                  </Avatar>
                  <span>{selectedPost.author}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedPost.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm mt-6 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleLikePost(selectedPost.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Like ({selectedPost.likes})</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Comments ({selectedPost.comments})</h4>
                
                {/* Placeholder for comments */}
                {selectedPost.comments > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center text-sm mb-1">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback>W</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Wanjiku M.</span>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm">I've had success with the Roma VF variety which is more drought resistant. Make sure to also apply mulch early in the season to retain soil moisture.</p>
                    </div>
                    
                    {/* More comments here */}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <Textarea placeholder="Add your comment..." className="min-h-[60px]" />
                  <div className="flex justify-end mt-2">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityForums;

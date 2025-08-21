
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageSquare, Users, Calendar, ThumbsUp, Reply } from 'lucide-react';

const CommunityForums: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const forumCategories = [
    { id: 'all', name: 'All Categories', count: 156 },
    { id: 'crop-management', name: 'Crop Management', count: 45 },
    { id: 'pest-control', name: 'Pest & Disease Control', count: 32 },
    { id: 'market-prices', name: 'Market Prices', count: 28 },
    { id: 'farming-techniques', name: 'Farming Techniques', count: 51 }
  ];

  const forumPosts = [
    {
      id: '1',
      title: 'Best practices for maize farming in dry season',
      category: 'crop-management',
      author: 'John Mwangi',
      authorAvatar: '/avatars/john.jpg',
      timeAgo: '2 hours ago',
      replies: 12,
      likes: 24,
      excerpt: 'Looking for advice on irrigation methods and drought-resistant varieties...',
      tags: ['maize', 'irrigation', 'drought']
    },
    {
      id: '2',
      title: 'Current market prices for French beans in Nairobi',
      category: 'market-prices',
      author: 'Mary Wanjiku',
      authorAvatar: '/avatars/mary.jpg',
      timeAgo: '5 hours ago',
      replies: 8,
      likes: 15,
      excerpt: 'Has anyone sold French beans in Nairobi recently? What are the current rates?',
      tags: ['french-beans', 'nairobi', 'prices']
    },
    {
      id: '3',
      title: 'Organic pest control methods for tomatoes',
      category: 'pest-control',
      author: 'Peter Kiprotich',
      authorAvatar: '/avatars/peter.jpg',
      timeAgo: '1 day ago',
      replies: 18,
      likes: 32,
      excerpt: 'Share your experience with natural pest control methods that actually work...',
      tags: ['tomatoes', 'organic', 'pest-control']
    },
    {
      id: '4',
      title: 'Greenhouse farming setup and costs',
      category: 'farming-techniques',
      author: 'Sarah Ochieng',
      authorAvatar: '/avatars/sarah.jpg',
      timeAgo: '2 days ago',
      replies: 25,
      likes: 41,
      excerpt: 'Planning to set up a greenhouse. What are the initial costs and best practices?',
      tags: ['greenhouse', 'setup', 'investment']
    }
  ];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Community Forums</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Connect with fellow farmers, share knowledge, and get expert advice
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Start New Discussion</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {forumCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Forum Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Members</span>
                    <span className="font-medium">3,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">New Today</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forum Posts */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 hover:text-primary cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.authorAvatar} />
                          <AvatarFallback>
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{post.author}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.timeAgo}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {post.replies}
                        </div>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or be the first to start a discussion in this category!
                  </p>
                  <Button>Start New Discussion</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommunityForums;

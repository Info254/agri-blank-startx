
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SocialShare from '@/components/common/SocialShare';

interface PollData {
  id: string;
  question: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  userVote?: number;
}

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
      isVerified?: boolean;
    };
    category: string;
    tags: string[];
    location?: string;
    likes: number;
    comments: number;
    createdAt: string;
    poll?: PollData;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onVote?: (pollId: string, optionIndex: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onVote 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const handleVote = (optionIndex: number) => {
    if (post.poll && !post.poll.userVote !== undefined) {
      onVote?.(post.poll.id, optionIndex);
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
    onShare?.(post.id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{post.author.name}</h4>
                {post.author.isVerified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    {post.location}
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{post.content}</p>
        </div>

        {post.poll && (
          <Card className="p-4 bg-muted/20">
            <h4 className="font-medium mb-3">{post.poll.question}</h4>
            <div className="space-y-2">
              {post.poll.options.map((option, index) => {
                const percentage = getVotePercentage(option.votes, post.poll!.totalVotes);
                const hasVoted = post.poll!.userVote !== undefined;
                const isUserChoice = post.poll!.userVote === index;
                
                return (
                  <div key={index} className="space-y-1">
                    <Button
                      variant={isUserChoice ? "default" : "outline"}
                      className="w-full justify-start relative overflow-hidden"
                      onClick={() => handleVote(index)}
                      disabled={hasVoted}
                    >
                      {hasVoted && (
                        <div 
                          className="absolute left-0 top-0 h-full bg-primary/20 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      )}
                      <span className="relative z-10">{option.text}</span>
                      {hasVoted && (
                        <span className="relative z-10 ml-auto text-sm">
                          {option.votes} ({percentage.toFixed(1)}%)
                        </span>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {post.poll.totalVotes} total votes
            </p>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{post.category}</Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">#{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onComment?.(post.id)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showShareOptions && (
          <div className="pt-2 border-t">
            <SocialShare
              title={`${post.title} by ${post.author.name}`}
              text={`${post.content}\n\nShared from AgriConnect Community Forum`}
              size="sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;

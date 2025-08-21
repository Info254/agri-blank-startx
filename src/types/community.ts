
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  location?: string;
  userName?: string;
  created?: string;
  userId?: string;
  user_id?: string;
  created_at?: string;
  likes_count?: number;
  comments_count?: number;
  is_active?: boolean;
  profiles?: {
    full_name: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
  community_polls?: Array<{
    id: string;
    question: string;
    options: Array<{
      text: string;
      votes: number;
    }>;
    total_votes: number;
  }>;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Poll {
  id: string;
  postId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface PollVote {
  id: string;
  pollId: string;
  userId: string;
  optionIndex: number;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  likesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

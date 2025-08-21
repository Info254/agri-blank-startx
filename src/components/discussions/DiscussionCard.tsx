
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityControlDiscussion } from "@/types";
import { MessageSquare, Eye, Clock } from "lucide-react";

interface DiscussionCardProps {
  discussion: QualityControlDiscussion;
  filterTag: string;
  setFilterTag: (tag: string) => void;
}

export const DiscussionCard = ({ discussion, filterTag, setFilterTag }: DiscussionCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{discussion.title}</CardTitle>
        <CardDescription className="flex items-center">
          Started by {discussion.authorName}
          <Badge variant="outline" className="ml-2 text-xs">
            {discussion.authorType}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{discussion.content}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {discussion.tags.map(tag => (
            <Badge 
              key={tag} 
              variant={filterTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <span className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            {discussion.commentCount} comments
          </span>
          <span className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            {discussion.viewCount} views
          </span>
          <span className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {new Date(discussion.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Button variant="ghost" size="sm">
          View Discussion
        </Button>
      </CardFooter>
    </Card>
  );
};

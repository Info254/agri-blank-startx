
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DiscussionHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quality Control Discussions</h1>
        <p className="text-muted-foreground mt-2">
          Join the conversation on agricultural quality standards and challenges
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button>
          <PenSquare className="mr-2 h-4 w-4" /> Start New Discussion
        </Button>
      </div>
    </div>
  );
};


import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DiscussionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterTag: string;
  setFilterTag: (value: string) => void;
  allTags: string[];
}

export const DiscussionFilters = ({
  searchTerm,
  setSearchTerm,
  filterTag,
  setFilterTag,
  allTags,
}: DiscussionFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="md:col-span-3">
        <Input
          placeholder="Search discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};


import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface FilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCounty: string;
  setSelectedCounty: (value: string) => void;
  filteredCount: number;
  counties: Array<{ value: string; label: string; }>;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  providerCategories: string[];
}

export const ProviderFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCounty,
  setSelectedCounty,
  filteredCount,
  counties,
  selectedCategory,
  setSelectedCategory,
  providerCategories,
}: FilterProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="relative">
        <Input
          placeholder="Search by name, service or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <Select
          value={selectedCounty}
          onValueChange={setSelectedCounty}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by county" />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county.value} value={county.value}>
                {county.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Provider Category" />
          </SelectTrigger>
          <SelectContent>
            {providerCategories.map((cat: string) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-end">
        <span className="text-sm text-muted-foreground mr-2">
          {filteredCount} providers found
        </span>
      </div>
    </div>
  );
};

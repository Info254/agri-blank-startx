
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceProviderType } from "@/types";

interface ProviderTabsProps {
  activeTab: ServiceProviderType | "all";
  onTabChange: (value: string) => void;
  providerTypes: Array<{ value: ServiceProviderType | "all"; label: string; }>;
}

export const ProviderTabs = ({ activeTab, onTabChange, providerTypes }: ProviderTabsProps) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
      {providerTypes.map((type) => (
        <TabsTrigger 
          key={type.value} 
          value={type.value} 
          className="text-xs md:text-sm"
        >
          {type.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

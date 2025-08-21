
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category, SOLUTION_CATEGORIES } from '@/types';
import { Lightbulb, FileCog, Tractor, Award } from 'lucide-react';

interface CategoryTabsProps {
  activeTab: Category | 'all';
  setActiveTab: (tab: Category | 'all') => void;
  hideTenderTabs?: boolean; // New prop to hide tender-related tabs
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  activeTab, 
  setActiveTab,
  hideTenderTabs = false // Default to showing all tabs
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Category | 'all')}>
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <span>All</span>
        </TabsTrigger>
        <TabsTrigger value="agriculture" className="flex items-center gap-2">
          <Tractor className="h-4 w-4" />
          <span>Agricultural Issues</span>
        </TabsTrigger>
        <TabsTrigger value="solutions" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <span>Innovative Solutions</span>
        </TabsTrigger>
        
        {!hideTenderTabs && (
          <>
            <TabsTrigger value="tender" className="flex items-center gap-2">
              <FileCog className="h-4 w-4" />
              <span>Tender Opportunities</span>
            </TabsTrigger>
            <TabsTrigger value="awarded-tender" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Awarded Tenders</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>
    </Tabs>
  );
};

export default CategoryTabs;

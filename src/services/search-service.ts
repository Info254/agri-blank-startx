import { supabase } from '@/lib/supabaseClient';

interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sort?: SortOptions;
  pagination?: PaginationOptions;
  fuzzy?: boolean;
  highlight?: boolean;
}

interface SearchFilters {
  category?: string[];
  priceRange?: { min: number; max: number };
  location?: string[];
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  verified?: boolean;
  inStock?: boolean;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface PaginationOptions {
  page: number;
  limit: number;
}

interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  facets: SearchFacets;
  suggestions?: string[];
  searchTime: number;
}

interface SearchFacets {
  categories: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  priceRanges: { range: string; count: number }[];
  tags: { name: string; count: number }[];
}

export class SearchService {
  private static instance: SearchService;
  private searchIndex: Map<string, any> = new Map();
  private stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'na', 'ya', 'wa', 'ni', 'za', 'kwa'
  ]);

  private constructor() {
    this.initializeSearchIndex();
  }

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async searchProducts(options: SearchOptions): Promise<SearchResult<any>> {
    const startTime = Date.now();
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(name),
          users(name, location),
          product_images(url)
        `);

      // Apply full-text search
      if (options.query) {
        const searchTerms = this.preprocessQuery(options.query);
        query = this.applyFullTextSearch(query, searchTerms, [
          'name', 'description', 'category', 'tags'
        ]);
      }

      // Apply filters
      query = this.applyFilters(query, options.filters);

      // Apply sorting
      if (options.sort) {
        query = query.order(options.sort.field, { ascending: options.sort.direction === 'asc' });
      } else {
        // Default relevance sorting
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const { page = 1, limit = 20 } = options.pagination || {};
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // Get facets
      const facets = await this.generateFacets('products', options.filters);

      // Generate suggestions for empty results
      const suggestions = data?.length === 0 ? 
        await this.generateSuggestions(options.query) : undefined;

      const searchTime = Date.now() - startTime;

      return {
        items: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        facets,
        suggestions,
        searchTime
      };
    } catch (error) {
      console.error('Product search failed:', error);
      throw error;
    }
  }

  async searchMarkets(options: SearchOptions): Promise<SearchResult<any>> {
    const startTime = Date.now();
    
    try {
      let query = supabase
        .from('city_markets')
        .select(`
          *,
          market_agents(name, phone),
          market_products(*)
        `);

      if (options.query) {
        const searchTerms = this.preprocessQuery(options.query);
        query = this.applyFullTextSearch(query, searchTerms, [
          'name', 'location', 'description'
        ]);
      }

      query = this.applyFilters(query, options.filters);

      if (options.sort) {
        query = query.order(options.sort.field, { ascending: options.sort.direction === 'asc' });
      }

      const { page = 1, limit = 20 } = options.pagination || {};
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const facets = await this.generateFacets('city_markets', options.filters);
      const suggestions = data?.length === 0 ? 
        await this.generateSuggestions(options.query) : undefined;

      return {
        items: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        facets,
        suggestions,
        searchTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Market search failed:', error);
      throw error;
    }
  }

  async searchUsers(options: SearchOptions): Promise<SearchResult<any>> {
    const startTime = Date.now();
    
    try {
      let query = supabase
        .from('users')
        .select(`
          id, name, email, location, user_type, verified,
          farmer_profiles(*),
          transporter_profiles(*)
        `);

      if (options.query) {
        const searchTerms = this.preprocessQuery(options.query);
        query = this.applyFullTextSearch(query, searchTerms, [
          'name', 'location', 'user_type'
        ]);
      }

      query = this.applyFilters(query, options.filters);

      if (options.sort) {
        query = query.order(options.sort.field, { ascending: options.sort.direction === 'asc' });
      }

      const { page = 1, limit = 20 } = options.pagination || {};
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const facets = await this.generateFacets('users', options.filters);

      return {
        items: data || [],
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        facets,
        suggestions: undefined,
        searchTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('User search failed:', error);
      throw error;
    }
  }

  async globalSearch(options: SearchOptions): Promise<{
    products: SearchResult<any>;
    markets: SearchResult<any>;
    users: SearchResult<any>;
  }> {
    const [products, markets, users] = await Promise.all([
      this.searchProducts({ ...options, pagination: { page: 1, limit: 5 } }),
      this.searchMarkets({ ...options, pagination: { page: 1, limit: 5 } }),
      this.searchUsers({ ...options, pagination: { page: 1, limit: 5 } })
    ]);

    return { products, markets, users };
  }

  private preprocessQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 2 && !this.stopWords.has(term))
      .map(term => this.stemWord(term));
  }

  private stemWord(word: string): string {
    // Simple stemming for English and Swahili
    const suffixes = ['ing', 'ed', 'er', 'est', 's', 'es', 'ies', 'ied'];
    
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return word.slice(0, -suffix.length);
      }
    }
    
    return word;
  }

  private applyFullTextSearch(query: any, searchTerms: string[], fields: string[]): any {
    if (searchTerms.length === 0) return query;

    // Use PostgreSQL full-text search with ranking
    const searchQuery = searchTerms.join(' | ');
    
    // Create text search vector from multiple fields
    const tsVector = fields.map(field => `coalesce(${field}, '')`).join(" || ' ' || ");
    
    return query
      .textSearch('fts', searchQuery, {
        type: 'websearch',
        config: 'english'
      })
      .order('ts_rank(to_tsvector(\'english\', ' + tsVector + '), websearch_to_tsquery(\'english\', \'' + searchQuery + '\'))', { ascending: false });
  }

  private applyFilters(query: any, filters?: SearchFilters): any {
    if (!filters) return query;

    if (filters.category?.length) {
      query = query.in('category', filters.category);
    }

    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        query = query.gte('price', filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        query = query.lte('price', filters.priceRange.max);
      }
    }

    if (filters.location?.length) {
      query = query.in('location', filters.location);
    }

    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('created_at', filters.dateRange.start.toISOString());
      }
      if (filters.dateRange.end) {
        query = query.lte('created_at', filters.dateRange.end.toISOString());
      }
    }

    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified);
    }

    if (filters.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock);
    }

    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags);
    }

    return query;
  }

  private async generateFacets(table: string, filters?: SearchFilters): Promise<SearchFacets> {
    try {
      const facetQueries = await Promise.allSettled([
        this.getCategoryFacets(table, filters),
        this.getLocationFacets(table, filters),
        this.getPriceRangeFacets(table, filters),
        this.getTagFacets(table, filters)
      ]);

      return {
        categories: facetQueries[0].status === 'fulfilled' ? facetQueries[0].value : [],
        locations: facetQueries[1].status === 'fulfilled' ? facetQueries[1].value : [],
        priceRanges: facetQueries[2].status === 'fulfilled' ? facetQueries[2].value : [],
        tags: facetQueries[3].status === 'fulfilled' ? facetQueries[3].value : []
      };
    } catch (error) {
      console.error('Failed to generate facets:', error);
      return { categories: [], locations: [], priceRanges: [], tags: [] };
    }
  }

  private async getCategoryFacets(table: string, filters?: SearchFilters): Promise<{ name: string; count: number }[]> {
    let query = supabase
      .from(table)
      .select('category', { count: 'exact' });

    query = this.applyFilters(query, { ...filters, category: undefined });

    const { data, error } = await query;
    if (error) throw error;

    const categoryCount = new Map<string, number>();
    data?.forEach(item => {
      const category = item.category;
      if (category) {
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      }
    });

    return Array.from(categoryCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  private async getLocationFacets(table: string, filters?: SearchFilters): Promise<{ name: string; count: number }[]> {
    let query = supabase
      .from(table)
      .select('location', { count: 'exact' });

    query = this.applyFilters(query, { ...filters, location: undefined });

    const { data, error } = await query;
    if (error) throw error;

    const locationCount = new Map<string, number>();
    data?.forEach(item => {
      const location = item.location;
      if (location) {
        locationCount.set(location, (locationCount.get(location) || 0) + 1);
      }
    });

    return Array.from(locationCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  private async getPriceRangeFacets(table: string, filters?: SearchFilters): Promise<{ range: string; count: number }[]> {
    const priceRanges = [
      { min: 0, max: 100, label: '0-100' },
      { min: 100, max: 500, label: '100-500' },
      { min: 500, max: 1000, label: '500-1000' },
      { min: 1000, max: 5000, label: '1000-5000' },
      { min: 5000, max: Infinity, label: '5000+' }
    ];

    const rangeCounts = await Promise.all(
      priceRanges.map(async (range) => {
        let query = supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        query = this.applyFilters(query, { ...filters, priceRange: undefined });

        if (range.max !== Infinity) {
          query = query.gte('price', range.min).lt('price', range.max);
        } else {
          query = query.gte('price', range.min);
        }

        const { count } = await query;
        return { range: range.label, count: count || 0 };
      })
    );

    return rangeCounts.filter(item => item.count > 0);
  }

  private async getTagFacets(table: string, filters?: SearchFilters): Promise<{ name: string; count: number }[]> {
    let query = supabase
      .from(table)
      .select('tags');

    query = this.applyFilters(query, { ...filters, tags: undefined });

    const { data, error } = await query;
    if (error) throw error;

    const tagCount = new Map<string, number>();
    data?.forEach(item => {
      const tags = item.tags || [];
      tags.forEach((tag: string) => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 tags
  }

  private async generateSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 3) return [];

    try {
      // Get popular search terms and product names for suggestions
      const { data: products } = await supabase
        .from('products')
        .select('name, category')
        .ilike('name', `%${query}%`)
        .limit(5);

      const { data: categories } = await supabase
        .from('categories')
        .select('name')
        .ilike('name', `%${query}%`)
        .limit(3);

      const suggestions: string[] = [];
      
      products?.forEach(product => {
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(product.name);
        }
      });

      categories?.forEach(category => {
        if (category.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(category.name);
        }
      });

      return [...new Set(suggestions)].slice(0, 5);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      return [];
    }
  }

  private async initializeSearchIndex(): Promise<void> {
    // Initialize search index for better performance
    try {
      // This would typically load frequently searched terms, synonyms, etc.
      console.log('Search index initialized');
    } catch (error) {
      console.error('Failed to initialize search index:', error);
    }
  }

  // Auto-complete functionality
  async getAutocompleteSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const { data } = await supabase
        .from('search_suggestions')
        .select('suggestion')
        .ilike('suggestion', `${query}%`)
        .order('frequency', { ascending: false })
        .limit(limit);

      return data?.map(item => item.suggestion) || [];
    } catch (error) {
      console.error('Autocomplete failed:', error);
      return [];
    }
  }

  // Track search analytics
  async trackSearch(query: string, resultCount: number, userId?: string): Promise<void> {
    try {
      await supabase
        .from('search_analytics')
        .insert([{
          query: query.toLowerCase(),
          result_count: resultCount,
          user_id: userId,
          timestamp: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  }
}

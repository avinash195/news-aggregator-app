import { useState, useEffect } from 'react';
import { NewsService } from '../services/newsService';
import type { Filter } from '../types';

interface UseFiltersReturn {
  filters: Filter;
  categories: string[];
  sources: string[];
  dateRanges: string[];
  sortOptions: string[];
  loading: boolean;
  updateFilter: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filter>({
    category: 'All Categories',
    source: 'All Sources',
    dateRange: 'All Time',
    sortBy: 'Date (Newest)'
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [dateRanges, setDateRanges] = useState<string[]>([]);
  const [sortOptions, setSortOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoriesData, sourcesData, dateRangesData, sortOptionsData] = await Promise.all([
          NewsService.getCategories(),
          NewsService.getSources(),
          NewsService.getDateRanges(),
          NewsService.getSortOptions()
        ]);

        setCategories(categoriesData);
        setSources(sourcesData);
        setDateRanges(dateRangesData);
        setSortOptions(sortOptionsData);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const updateFilter = <K extends keyof Filter>(key: K, value: Filter[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All Categories',
      source: 'All Sources',
      dateRange: 'All Time',
      sortBy: 'Date (Newest)'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'All Categories') count++;
    if (filters.source !== 'All Sources') count++;
    if (filters.dateRange !== 'All Time') count++;
    if (filters.sortBy !== 'Date (Newest)') count++;
    return count;
  };

  return {
    filters,
    categories,
    sources,
    dateRanges,
    sortOptions,
    loading,
    updateFilter,
    resetFilters,
    getActiveFiltersCount
  };
}

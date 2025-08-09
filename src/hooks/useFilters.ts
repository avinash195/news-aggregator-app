import { useState, useEffect } from 'react';
import { NewsService } from '../services/newsService';
import type { Filter } from '../types';

interface UseFiltersReturn {
  filters: Filter;
  categories: string[];
  sources: string[];
  dateRanges: string[];
  loading: boolean;
  updateFilter: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filter>({
    category: 'All Categories',
    source: 'All Sources',
    dateRange: 'All Time'
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [dateRanges, setDateRanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoriesData, sourcesData, dateRangesData] = await Promise.all([
          NewsService.getCategories(),
          NewsService.getSources(),
          NewsService.getDateRanges()
        ]);

        setCategories(categoriesData);
        setSources(sourcesData);
        setDateRanges(dateRangesData);
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
      dateRange: 'All Time'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'All Categories') count++;
    if (filters.source !== 'All Sources') count++;
    if (filters.dateRange !== 'All Time') count++;
    return count;
  };

  return {
    filters,
    categories,
    sources,
    dateRanges,
    loading,
    updateFilter,
    resetFilters,
    getActiveFiltersCount
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsService } from '../services/newsService';
import type { Filter, UserPreferences } from '../types';

interface UseFiltersReturn {
  filters: Filter;
  categories: string[];
  sources: string[];
  dateRanges: string[];
  loading: boolean;
  updateFilter: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
  applyPreferences: (preferences: UserPreferences) => void;
}

export function useFilters(preferences: UserPreferences): UseFiltersReturn {
  const [filters, setFilters] = useState<Filter>({
    category: 'All Categories',
    source: 'All Sources',
    dateRange: 'All Time'
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [dateRanges, setDateRanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use refs to track if this is the initial load and prevent unnecessary updates
  const isInitialLoad = useRef(true);
  const previousPreferences = useRef<UserPreferences>(preferences);

  // Apply preferences to filters when preferences change (but only if they actually changed)
  useEffect(() => {
    // Skip on initial load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Check if preferences actually changed
    const hasChanged = 
      JSON.stringify(previousPreferences.current.preferredCategories) !== JSON.stringify(preferences.preferredCategories) ||
      JSON.stringify(previousPreferences.current.preferredSources) !== JSON.stringify(preferences.preferredSources);

    if (hasChanged) {
      const newFilters: Filter = {
        category: 'All Categories',
        source: 'All Sources',
        dateRange: 'All Time'
      };

      // Apply first category preference if available
      if (preferences.preferredCategories.length > 0) {
        newFilters.category = preferences.preferredCategories[0];
      }
      
      // Apply first source preference if available
      if (preferences.preferredSources.length > 0) {
        newFilters.source = preferences.preferredSources[0];
      }

      setFilters(newFilters);
      previousPreferences.current = preferences;
    }
  }, [preferences]);

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

  const updateFilter = useCallback(<K extends keyof Filter>(key: K, value: Filter[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: 'All Categories',
      source: 'All Sources',
      dateRange: 'All Time'
    });
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.category !== 'All Categories') count++;
    if (filters.source !== 'All Sources') count++;
    if (filters.dateRange !== 'All Time') count++;
    return count;
  }, [filters]);

  const applyPreferences = useCallback((newPreferences: UserPreferences) => {
    const newFilters: Filter = {
      category: 'All Categories',
      source: 'All Sources',
      dateRange: 'All Time'
    };

    // Apply first category preference if available
    if (newPreferences.preferredCategories && newPreferences.preferredCategories.length > 0) {
      newFilters.category = newPreferences.preferredCategories[0];
    }
    
    // Apply first source preference if available
    if (newPreferences.preferredSources && newPreferences.preferredSources.length > 0) {
      newFilters.source = newPreferences.preferredSources[0];
    }

    setFilters(newFilters);
  }, []);

  return {
    filters,
    categories,
    sources,
    dateRanges,
    loading,
    updateFilter,
    resetFilters,
    getActiveFiltersCount,
    applyPreferences
  };
}

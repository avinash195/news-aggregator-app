import { useState, useEffect, useCallback, useRef } from 'react';
import type { Article, Filter } from '../types';
import { NewsService } from '../services/newsService';

interface UseNewsApiReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  searchArticles: (query: string) => void;
  applyFilters: (filters: Filter) => void;
  refreshArticles: () => void;
  currentSearchQuery: string;
  hasMore: boolean;
  loadMore: () => void;
}

export function useNewsApi(): UseNewsApiReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState<Filter>({
    category: 'All Categories',
    source: 'All Sources',
    dateRange: 'All Time'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);

  // Use refs to track previous values and prevent unnecessary API calls
  const previousFilters = useRef<Filter>(currentFilters);
  const previousSearchQuery = useRef(searchQuery);
  const pageSize = 20; // Fixed page size for API calls

  const fetchArticles = useCallback(async (isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoading(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const page = isLoadMore ? currentPage + 1 : 1;
      const result = await NewsService.getArticles(
        currentFilters,
        searchQuery,
        page,
        pageSize
      );

      if (isLoadMore) {
        // Append new articles for infinite scroll
        setArticles(prev => [...prev, ...result.articles]);
        setCurrentPage(page);
      } else {
        // Replace articles for new search/filter
        setArticles(result.articles);
        setCurrentPage(1);
      }

      setTotalResults(result.totalResults);
      
      // Check if there are more articles to load
      // For infinite scroll, we consider there are more if we got a full page of results
      setHasMore(result.articles.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      if (!isLoadMore) {
        setArticles([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  }, [currentFilters, searchQuery, currentPage, pageSize]);

  // Only fetch articles when there are actual changes
  useEffect(() => {
    const hasFiltersChanged = 
      previousFilters.current.category !== currentFilters.category ||
      previousFilters.current.source !== currentFilters.source ||
      previousFilters.current.dateRange !== currentFilters.dateRange;
    
    const hasSearchChanged = previousSearchQuery.current !== searchQuery;

    if (hasFiltersChanged || hasSearchChanged) {
      previousFilters.current = currentFilters;
      previousSearchQuery.current = searchQuery;
      setCurrentPage(1);
      setHasMore(true);
      fetchArticles(false);
    }
  }, [currentFilters, searchQuery, fetchArticles]);

  const searchArticles = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  const applyFilters = useCallback((filters: Filter) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchArticles(true);
    }
  }, [loading, hasMore, fetchArticles]);

  const refreshArticles = useCallback(() => {
    fetchArticles(false);
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    totalResults,
    searchArticles,
    applyFilters,
    refreshArticles,
    currentSearchQuery: searchQuery,
    hasMore,
    loadMore
  };
}

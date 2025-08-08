import { useState, useEffect, useCallback } from 'react';
import type { Article, Filter, PaginationInfo } from '../types';
import { NewsService } from '../services/newsService';

interface UseNewsApiReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  searchArticles: (query: string) => void;
  applyFilters: (filters: Filter) => void;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  refreshArticles: () => void;
  currentSearchQuery: string;
}

export function useNewsApi(): UseNewsApiReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    pageSize: 10
  });
  const [currentFilters, setCurrentFilters] = useState<Filter>({
    category: 'All Categories',
    source: 'All Sources',
    dateRange: 'All Time',
    sortBy: 'Date (Newest)'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await NewsService.getArticles(
        currentFilters,
        searchQuery,
        pagination.currentPage,
        pagination.pageSize
      );

      setArticles(result.articles);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, searchQuery, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const searchArticles = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const applyFilters = useCallback((filters: Filter) => {
    setCurrentFilters(filters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const changePageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, currentPage: 1 }));
  }, []);

  const refreshArticles = useCallback(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    pagination,
    searchArticles,
    applyFilters,
    changePage,
    changePageSize,
    refreshArticles,
    currentSearchQuery: searchQuery
  };
}

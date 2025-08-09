import { useEffect, useRef, useCallback } from 'react';
// import { useState } from 'react';
import { useNewsApi } from '../hooks/useNewsApi';
import { useFilters } from '../hooks/useFilters';
import { Filters } from '../components/Filters';
import { ArticleCard } from '../components/ArticleCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Article, UserPreferences } from '../types';

export function Home({ searchQuery, preferences }: { searchQuery: string; preferences: UserPreferences }) {
  const {
    articles,
    loading,
    error,
    totalResults,
    applyFilters,
    searchArticles,
    refreshArticles,
    currentSearchQuery,
    hasMore,
    loadMore
  } = useNewsApi();

  const {
    filters,
    categories,
    sources,
    dateRanges,
    updateFilter,
    resetFilters,
    getActiveFiltersCount,
    applyPreferences
  } = useFilters(preferences);

  // Use refs to track previous values and prevent unnecessary API calls
  const previousSearchQuery = useRef(searchQuery);
  const previousFilters = useRef(filters);
  const isInitialLoad = useRef(true);

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Callback for intersection observer
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore]);

  // Trigger search when searchQuery changes (but only if it actually changed)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousSearchQuery.current = searchQuery;
      return;
    }

    if (searchQuery !== previousSearchQuery.current) {
      console.log('Home: Search query changed:', searchQuery);
      previousSearchQuery.current = searchQuery;
      searchArticles(searchQuery);
    }
  }, [searchQuery, searchArticles]);

  // Apply preferences when they change (but only if they actually changed)
  useEffect(() => {
    if (isInitialLoad.current) {
      return;
    }

    if (preferences.preferredCategories.length > 0 || preferences.preferredSources.length > 0) {
      applyPreferences(preferences);
    }
  }, [preferences, applyPreferences]);

  // Apply filters when they change (but only if they actually changed)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousFilters.current = filters;
      return;
    }

    // Check if filters actually changed
    const hasChanged = 
      previousFilters.current.category !== filters.category ||
      previousFilters.current.source !== filters.source ||
      previousFilters.current.dateRange !== filters.dateRange;

    if (hasChanged) {
      previousFilters.current = filters;
      applyFilters(filters);
    }
  }, [filters, applyFilters]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Saved articles state (for future implementation)
  // const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());

  const handleSaveArticle = (article: Article) => {
    // TODO: Implement saved articles functionality
    console.log('Saving article:', article.title);
  };

  const handleShareArticle = (article: Article) => {
    // Share functionality is handled in the ArticleCard component
    console.log('Sharing article:', article.title);
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
  };

  const handleClearFilters = () => {
    resetFilters();
    applyFilters({
      category: 'All Categories',
      source: 'All Sources',
      dateRange: 'All Time'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile, shown on larger screens */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="xl:sticky xl:top-4">
              <Filters
                filters={filters}
                categories={categories}
                sources={sources}
                dateRanges={dateRanges}
                activeFiltersCount={getActiveFiltersCount()}
                onFilterChange={updateFilter}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                loading={loading}
                preferences={preferences}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Latest News</h2>
              <p className="text-base sm:text-lg text-gray-600">
                {totalResults} results found
              </p>
              {currentSearchQuery && (
                <p className="text-sm text-blue-600 mt-2">
                  🔍 Searching for: "{currentSearchQuery}"
                </p>
              )}
              {articles.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Showing {articles.length} articles from {totalResults} total results
                </p>
              )}
            </div>

            {/* Active Filter Tags */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  const isDefault = (key === 'category' && value === 'All Categories') ||
                                   (key === 'source' && value === 'All Sources') ||
                                   (key === 'dateRange' && value === 'All Time');
                  
                  if (isDefault) return null;

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800"
                    >
                      {key === 'category' ? 'Category' : 
                       key === 'source' ? 'Source' : 
                       key === 'dateRange' ? 'Date Range' : 'Sort'}: {value}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Articles Grid */}
            {loading && articles.length === 0 ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader size="lg" />
              </div>
            ) : error && articles.length === 0 ? (
              <ErrorMessage
                message={error}
                onRetry={refreshArticles}
              />
            ) : articles.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📰</div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-sm sm:text-base text-gray-600 px-4">
                  {currentSearchQuery ? `No results found for "${currentSearchQuery}"` : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSave={handleSaveArticle}
                    onShare={handleShareArticle}
                  />
                ))}
              </div>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div 
                ref={lastElementRef}
                className="flex items-center justify-center py-6 sm:py-8"
              >
                {loading ? (
                  <Loader size="md" />
                ) : (
                  <div className="text-gray-500 text-xs sm:text-sm text-center px-4">
                    Scroll down to load more articles...
                  </div>
                )}
              </div>
            )}

            {/* End of results */}
            {!hasMore && articles.length > 0 && (
              <div className="text-center py-6 sm:py-8">
                <div className="text-gray-400 text-3xl sm:text-4xl mb-2">🏁</div>
                <p className="text-sm sm:text-base text-gray-600">You've reached the end of the results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

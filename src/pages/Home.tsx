import { useEffect } from 'react';
// import { useState } from 'react';
import { useNewsApi } from '../hooks/useNewsApi';
import { useFilters } from '../hooks/useFilters';
import { Filters } from '../components/Filters';
import { ArticleCard } from '../components/ArticleCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Pagination } from '../components/Pagination';
import type { Article } from '../types';

export function Home({ searchQuery }: { searchQuery: string }) {
  const {
    articles,
    loading,
    error,
    pagination,
    applyFilters,
    searchArticles,
    changePage,
    changePageSize,
    refreshArticles,
    currentSearchQuery
  } = useNewsApi();

  const {
    filters,
    categories,
    sources,
    dateRanges,
    sortOptions,
    updateFilter,
    resetFilters,
    getActiveFiltersCount
  } = useFilters();

  // Trigger search when searchQuery changes
  useEffect(() => {
    console.log('Home: Search query changed:', searchQuery);
    if (searchQuery !== currentSearchQuery) {
      searchArticles(searchQuery);
    }
  }, [searchQuery, searchArticles, currentSearchQuery]);

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
      dateRange: 'All Time',
      sortBy: 'Date (Newest)'
    });
  };

  // Pagination is now handled by the Pagination component

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Filters
                filters={filters}
                categories={categories}
                sources={sources}
                dateRanges={dateRanges}
                sortOptions={sortOptions}
                activeFiltersCount={getActiveFiltersCount()}
                onFilterChange={updateFilter}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                loading={loading}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Latest News</h2>
              <p className="text-lg text-gray-600">
                {pagination.totalResults} results found
              </p>
              {/* Search indicator */}
              {currentSearchQuery && (
                <p className="text-sm text-blue-600 mt-2">
                  🔍 Searching for: "{currentSearchQuery}"
                </p>
              )}
              {articles.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Showing {articles.length} articles from {pagination.totalResults} total results
                </p>
              )}
            </div>

            {/* Active Filter Tags */}
            {getActiveFiltersCount() > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  const isDefault = (key === 'category' && value === 'All Categories') ||
                                   (key === 'source' && value === 'All Sources') ||
                                   (key === 'dateRange' && value === 'All Time') ||
                                   (key === 'sortBy' && value === 'Date (Newest)');
                  
                  if (isDefault) return null;

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size="lg" />
              </div>
            ) : error ? (
              <ErrorMessage
                message={error}
                onRetry={refreshArticles}
              />
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  {currentSearchQuery ? `No results found for "${currentSearchQuery}"` : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {/* Enhanced Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={changePage}
              onPageSizeChange={changePageSize}
              showPageSizeSelector={true}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

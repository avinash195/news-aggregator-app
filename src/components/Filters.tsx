import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Filter } from '../types';

interface FiltersProps {
  filters: Filter;
  categories: string[];
  sources: string[];
  dateRanges: string[];
  activeFiltersCount: number;
  onFilterChange: <K extends keyof Filter>(key: K, value: Filter[K]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
  preferences?: {
    preferredSources: string[];
    preferredCategories: string[];
  };
  isMobile?: boolean;
}

export function Filters({
  filters,
  categories,
  sources,
  dateRanges,
  activeFiltersCount,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
  preferences,
  isMobile = false
}: FiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<keyof Filter | null>(null);

  const dropdowns = [
    {
      key: 'category' as keyof Filter,
      label: 'Category',
      value: filters.category,
      options: categories
    },
    {
      key: 'source' as keyof Filter,
      label: 'Source',
      value: filters.source,
      options: sources
    },
    {
      key: 'dateRange' as keyof Filter,
      label: 'Date Range',
      value: filters.dateRange,
      options: dateRanges
    }
  ];

  const handleDropdownToggle = (key: keyof Filter) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleOptionSelect = (key: keyof Filter, value: string) => {
    onFilterChange(key, value);
    setOpenDropdown(null);
  };

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg shadow-sm",
      isMobile ? "border-0 shadow-none" : "p-3 sm:p-4 lg:p-6"
    )}>
      {!isMobile && (
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center space-x-2">
            {preferences && (preferences.preferredCategories.length > 0 || preferences.preferredSources.length > 0) && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Preferences Active
              </span>
            )}
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={cn(
        "space-y-3 sm:space-y-4 lg:space-y-5",
        isMobile && "space-y-4"
      )}>
        {dropdowns.map((dropdown) => (
          <div key={dropdown.key} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              {dropdown.label}
            </label>
            <button
              type="button"
              onClick={() => handleDropdownToggle(dropdown.key)}
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-left text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className={dropdown.value ? "text-gray-900" : "text-gray-500"}>
                {dropdown.value || `Select ${dropdown.label.toLowerCase()}`}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                openDropdown === dropdown.key && "rotate-180"
              )} />
            </button>

            {openDropdown === dropdown.key && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {dropdown.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(dropdown.key, option)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                      option === dropdown.value && "bg-blue-50 text-blue-700"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className={cn(
          "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6",
          isMobile && "pt-6"
        )}>
          <button
            type="button"
            onClick={onApplyFilters}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={loading}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className={cn(
          "mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200",
          isMobile && "mt-4 pt-4"
        )}>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {dropdowns.map((dropdown) => {
              const isDefault = dropdown.key === 'category' && dropdown.value === 'All Categories' ||
                               dropdown.key === 'source' && dropdown.value === 'All Sources' ||
                               dropdown.key === 'dateRange' && dropdown.value === 'All Time';
              
              if (isDefault) return null;

              return (
                <span
                  key={dropdown.key}
                  className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {dropdown.label}: {dropdown.value}
                  {preferences && (
                    (dropdown.key === 'category' && preferences.preferredCategories.includes(dropdown.value)) ||
                    (dropdown.key === 'source' && preferences.preferredSources.includes(dropdown.value))
                  ) && (
                    <span className="ml-1 text-green-600">⭐</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const defaultValue = dropdown.key === 'category' ? 'All Categories' :
                                         dropdown.key === 'source' ? 'All Sources' :
                                         dropdown.key === 'dateRange' ? 'All Time' : '';
                      onFilterChange(dropdown.key, defaultValue);
                    }}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

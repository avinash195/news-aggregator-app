import { Link } from 'react-router-dom';
import { Settings, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

interface NavbarProps {
  onSearch: (query: string) => void;
  onPersonalizeFeed: () => void;
}

export function Navbar({ onSearch, onPersonalizeFeed }: NavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">News Aggregator</h1>
          </Link>

          {/* Desktop Search Bar and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="w-64 lg:w-80">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* Personalize Feed Button */}
            <button
              onClick={onPersonalizeFeed}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Personalize Feed</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Search Bar - Always visible */}
        <div className="md:hidden pb-3">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <button
              onClick={onPersonalizeFeed}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Personalize Feed</span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

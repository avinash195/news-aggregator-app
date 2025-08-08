import { Link } from 'react-router-dom';
import { Settings, ChevronDown } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface NavbarProps {
  onSearch: (query: string) => void;
  onPersonalizeFeed: () => void;
}

export function Navbar({ onSearch, onPersonalizeFeed }: NavbarProps) {

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">News Aggregator</h1>
          </Link>

          {/* Search Bar and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="w-80">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* Personalize Feed Button */}
            <button
              onClick={onPersonalizeFeed}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Personalize Feed</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
